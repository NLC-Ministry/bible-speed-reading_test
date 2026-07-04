# Architecture Consolidation & Test/CI Governance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the NLC Bible Speed Reading app reliable and safe to change for a growing team, by adding automated cache-busting, a real test suite, and a governed CI/CD pipeline — sequenced so the safety net exists before any risky refactor.

**Architecture:** The app is buildless vanilla JS using global `<script>` tags with load-order coupling (see `CLAUDE.md`). We harden it in phases: (0) automate content-based cache-busting without changing runtime semantics; (1) add a test runner and cover the highest-risk seams (the dual-client `nlc-data` shim and the deterministic domain logic); (2) modularize the god files behind those tests and introduce a bundler (Vite) once files are ES modules; (3) add E2E + Edge Function tests and full CI governance.

**Tech Stack:** Node 20+ (repo tested on v25), Vitest (test runner — Vite-native, jsdom for DOM), Playwright (E2E, later phase), Deno test (Edge Functions), GitHub Actions, Vercel (hosting).

## Global Constraints

- **No framework migration.** The app stays vanilla JS. We do not introduce React/Vue.
- **Global-script semantics must be preserved** until a file is explicitly modularized in Phase 2. Top-level `const`/`function` are global by design; do not add `type="module"` to `index.html` script tags in Phase 0 or 1.
- **Traditional Chinese** for all user-facing copy (see `js/copy/zh-Hant.js`).
- **Node version floor:** `>=20`.
- **Do not edit applied migrations** in `supabase/migrations/`; add new numbered files. `supabase/migrations_legacy/` is read-only history.
- **The entry document `index.html` is never content-hashed** (it is the bootstrap and is served `no-store`). Only assets it references are versioned.
- **Empirically verified:** Vite cannot bundle classic (non-module) scripts. Any task that introduces Vite MUST first convert the relevant files to ES modules.

---

## Phase 0 — Automatic content-based cache-busting (low logic risk)

**Why first:** Directly fixes the stale-cache pain with zero runtime-semantic change. Today every `<script>`/`<link>` `?v=` string is bumped by hand; forgetting one ships a broken mix of old/new files to members' phones. We replace the hand-typed version with a content hash computed at build time.

**Outcome:** `node build.js` (run by Vercel) regenerates `config.js` from `.env` (existing behavior) and rewrites every `?v=` on a local asset in `index.html` to an 8-char hash of that file's contents.

### Task 0.1: Content-hash build script

**Files:**
- Create: `scripts/hash-assets.mjs`
- Test: `scripts/hash-assets.test.mjs`

**Interfaces:**
- Produces: `rewriteAssetVersions(html: string, resolveHash: (relPath: string) => string | null) => string` — pure function that rewrites `?v=` query strings on local `src`/`href` attributes. Returns new HTML. `resolveHash` returns the hash for a given repo-relative path, or `null` to leave the tag unchanged (e.g. file missing).
- Produces (CLI): running `node scripts/hash-assets.mjs` rewrites `index.html` in place using real file hashes.

- [ ] **Step 1: Write the failing test**

```js
// scripts/hash-assets.test.mjs
import { describe, it, expect } from "vitest";
import { rewriteAssetVersions } from "./hash-assets.mjs";

describe("rewriteAssetVersions", () => {
  const resolve = (p) => ({
    "index.css": "aaaa1111",
    "js/state.js": "bbbb2222",
  })[p] ?? null;

  it("rewrites ?v= on local script and link tags to the content hash", () => {
    const html = `<link rel="stylesheet" href="index.css?v=old">
<script src="js/state.js?v=20260705_nlc"></script>`;
    const out = rewriteAssetVersions(html, resolve);
    expect(out).toContain('href="index.css?v=aaaa1111"');
    expect(out).toContain('src="js/state.js?v=bbbb2222"');
  });

  it("leaves external (http) and unknown-file tags untouched", () => {
    const html = `<script src="https://cdn.example.com/lib.js"></script>
<script src="js/missing.js?v=keepme"></script>`;
    const out = rewriteAssetVersions(html, resolve);
    expect(out).toBe(html);
  });

  it("adds ?v= to a local tag that has none", () => {
    const html = `<script src="js/state.js"></script>`;
    const out = rewriteAssetVersions(html, resolve);
    expect(out).toContain('src="js/state.js?v=bbbb2222"');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run scripts/hash-assets.test.mjs`
Expected: FAIL — `rewriteAssetVersions` is not exported / module not found.

- [ ] **Step 3: Write minimal implementation**

```js
// scripts/hash-assets.mjs
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Matches src="X" or href="X" where X is a local (non-http, non-protocol-relative) path,
// optionally already carrying a ?v=... query string.
const ATTR_RE = /(src|href)="(?!https?:|\/\/)([^"?#]+)(?:\?v=[^"#]*)?"/g;

export function rewriteAssetVersions(html, resolveHash) {
  return html.replace(ATTR_RE, (match, attr, path) => {
    const hash = resolveHash(path);
    if (!hash) return match;
    return `${attr}="${path}?v=${hash}"`;
  });
}

export function hashFile(absPath) {
  const buf = readFileSync(absPath);
  return createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  const root = dirname(dirname(fileURLToPath(import.meta.url)));
  const indexPath = join(root, "index.html");
  const html = readFileSync(indexPath, "utf8");
  const resolve = (rel) => {
    const abs = join(root, rel);
    return existsSync(abs) ? hashFile(abs) : null;
  };
  const out = rewriteAssetVersions(html, resolve);
  writeFileSync(indexPath, out, "utf8");
  console.log("hash-assets: rewrote asset versions in index.html");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run scripts/hash-assets.test.mjs`
Expected: PASS (3 tests).

- [ ] **Step 5: Run the CLI against the real repo and eyeball the diff**

Run: `node scripts/hash-assets.mjs && git --no-pager diff --stat index.html`
Expected: `index.html` shows changed `?v=` values on local `js/*.js` and `index.css`; external CDN scripts unchanged.

- [ ] **Step 6: Commit**

```bash
git add scripts/hash-assets.mjs scripts/hash-assets.test.mjs index.html
git commit -m "build: content-hash local asset versions automatically"
```

### Task 0.2: Wire hashing into the build and add Vitest

**Files:**
- Modify: `package.json` (scripts + devDependencies)
- Create: `build.js` (orchestrator) OR modify `vercel.json` to run both steps
- Modify: `vercel.json:3` (`buildCommand`)

**Interfaces:**
- Produces: `npm run build` runs config generation then asset hashing.
- Produces: `npm test` runs Vitest once (CI mode).

- [ ] **Step 1: Add Vitest and scripts to package.json**

```jsonc
// package.json — merge these
{
  "type": "module",
  "scripts": {
    "build": "node build-config.js && node scripts/hash-assets.mjs",
    "start": "npx serve .",
    "dev": "npx serve .",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "vitest": "^2.1.0"
  }
}
```

Note: `build-config.js` uses CommonJS (`require`). Adding `"type": "module"` makes `.js` files ESM by default. Rename `build-config.js` → `build-config.cjs` and update references, OR keep `"type"` unset and give new ESM files the `.mjs` extension (already done for `hash-assets.mjs`). **Chosen approach: do NOT add `"type": "module"`; keep new files as `.mjs`.** Remove the `"type": "module"` line above.

- [ ] **Step 2: Update vercel.json buildCommand**

```jsonc
// vercel.json
"buildCommand": "npm run build",
```

- [ ] **Step 3: Install and verify the full build runs**

Run: `npm install && npm run build`
Expected: prints the `build-config.js` summary AND `hash-assets: rewrote asset versions in index.html`, exit 0.

- [ ] **Step 4: Verify tests run**

Run: `npm test`
Expected: Vitest runs `scripts/hash-assets.test.mjs`, all pass.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json vercel.json
git commit -m "build: run config + hashing via npm build; add Vitest"
```

### Task 0.3: CI skeleton (GitHub Actions)

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Write the workflow**

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - name: Unit tests
        run: npm test
      - name: Verify build succeeds
        run: npm run build
        env:
          SUPABASE_URL: https://placeholder.supabase.co
          SUPABASE_ANON_KEY: placeholder
```

- [ ] **Step 2: Validate YAML locally**

Run: `node -e "require('fs').readFileSync('.github/workflows/ci.yml','utf8')" && echo ok` (basic read) — or use `actionlint` if available.
Expected: `ok`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: add build + unit-test workflow"
```

**Deployment note (surface to a human):** After merge, verify on a **Vercel preview URL** that `index.html` in the deployed output shows content-hashed `?v=` values and the app boots, *before* promoting to production. The git-committed `index.html` need not carry current hashes — Vercel rewrites them at build time.

---

## Phase 1 — Safety net on the highest-risk seams

**Why:** Two areas cause "prod-only breakage" and make change scary: (a) the `nlc-data` shim silently diverging from real PostgREST, and (b) untested deterministic domain logic buried in god files. We test both *before* refactoring.

### Task 1.1: Contract-test the nlc-data query shim

**Files:**
- Create: `js/data-client/query-builder.mjs` (extracted, pure serializer)
- Create: `js/data-client/query-builder.test.mjs`
- Modify: `js/db.js` (later — replace inline `NlcQueryBuilder` with the module once modules land in Phase 2; in Phase 1 the module is a *characterization copy* to lock current behavior)

**Interfaces:**
- Produces: `buildRequest(table) => builder` where builder supports `select/insert/update/delete/upsert/eq/is/in/or/order/limit/single/maybeSingle` and `.toRequest()` returns the JSON payload POSTed to `nlc-data`.

- [ ] **Step 1: Write failing tests capturing the CURRENT wire format**

```js
// js/data-client/query-builder.test.mjs
import { describe, it, expect } from "vitest";
import { buildRequest } from "./query-builder.mjs";

describe("nlc-data query serialization", () => {
  it("serializes a filtered select the way db.js does today", () => {
    const req = buildRequest("reading_logs")
      .select("book, chapter, read_at")
      .eq("user_id", "abc")
      .order("read_at", { ascending: false })
      .toRequest();
    expect(req).toEqual({
      table: "reading_logs",
      action: "select",
      select: "book, chapter, read_at",
      filters: [{ type: "eq", column: "user_id", value: "abc" }],
      order: { column: "read_at", ascending: false },
    });
  });

  it("defaults action to select and returning to maybeSingle", () => {
    const req = buildRequest("profiles").eq("id", "x").maybeSingle().toRequest();
    expect(req.action).toBe("select");
    expect(req.returning).toBe("maybeSingle");
  });
});
```

- [ ] **Step 2: Run to verify fail.** Run: `npx vitest run js/data-client/query-builder.test.mjs` → FAIL (module missing).

- [ ] **Step 3: Implement `buildRequest` by lifting the exact logic from `js/db.js:208-276`** (the `NlcQueryBuilder` class) into `query-builder.mjs`, exported as a factory. Add `.toRequest()` returning `this.request`. Do not change field names — this is characterization.

- [ ] **Step 4: Run to verify pass.**

- [ ] **Step 5: Add the divergence guard test** — assert the set of supported operators, so removing one breaks CI:

```js
it("exposes exactly the supported operator surface", () => {
  const b = buildRequest("t");
  const ops = ["select","insert","update","delete","upsert","eq","is","in","or","order","limit","single","maybeSingle"];
  ops.forEach((op) => expect(typeof b[op]).toBe("function"));
});
```

- [ ] **Step 6: Commit** `git commit -m "test: characterize nlc-data query builder contract"`

**Follow-up (own task/PR):** Generate the operator allowlist AND the Edge Function `nlc-data` table/action allowlist from one shared JSON so dev (Supabase client) and prod (shim) cannot drift. Tracked as Task 1.4.

### Task 1.2: Extract and unit-test plan scheduling logic

**Files:**
- Create: `js/domain/plan-schedule.mjs`
- Create: `js/domain/plan-schedule.test.mjs`
- Source of truth to characterize: the daily-chapter allocation currently in `js/views/plan.js` and `CHURCH_PLAN_PRESETS` in `js/state.js`.

- [ ] **Step 1:** Read the current allocation logic in `js/views/plan.js` (search for where `readingDays` and `target_books` become per-day chapter lists). Write tests that assert, for a known preset (e.g. `CHURCH_PLAN_PRESETS.q1` month 1, 27 reading days), the day-1 and last-day chapter assignments match current output. (Fill the expected arrays from a one-time `console.log` of the current function — capture real values, do not invent them.)
- [ ] **Step 2:** Run → fail.
- [ ] **Step 3:** Extract the pure allocation function into `plan-schedule.mjs` with signature `allocateChapters({ books, readingDays, level }) => Array<Day>`.
- [ ] **Step 4:** Run → pass.
- [ ] **Step 5:** Add level-multiplier cases (`normal`=1, `breakthrough`=2, `super`=3) from the UI copy in `index.html`.
- [ ] **Step 6:** Commit.

### Task 1.3: Extract and unit-test streak + stats aggregation

**Files:**
- Create: `js/domain/reading-stats.mjs`, `js/domain/reading-stats.test.mjs`

- [ ] Characterize the current streak calculation and total-chapters/rounds aggregation from `js/db.js`/`js/views/stats.js` (search for `streak` and `chapters_read`). Extract pure functions `computeStreak(logs, today) => number` and `aggregateProgress(logs, plan) => {...}`. TDD each with captured real values, then commit per function.

### Task 1.4: Single-source the data-access allowlist

- [ ] Create `shared/data-access-allowlist.json` listing allowed `{table: [actions]}`. Import it in the Phase-2 modularized shim AND reference it from `supabase/functions/nlc-data/index.ts`. Add a test asserting every table the app queries appears in the allowlist. Commit.

---

## Phase 2 — Modularize the god files, then introduce Vite (behind the tests)

**Why:** `js/views/plan.js` (~4,500 lines) and `js/db.js` (~2,000 lines) mix data access, rendering, and logic. With Phase 1 tests in place, decomposition is safe. Only after files are ES modules can Vite bundle + hash *filenames* (replacing Phase 0's query-string hashing).

High-level tasks (each becomes its own sub-plan via `writing-plans` when Phase 1 is green):

- [ ] **2.1** Split `js/db.js` into `data-client/` (Supabase client + nlc shim + `from()` router), `data/` (per-entity read/write: plans, logs, profiles, announcements, org), keeping global-compatible shims until the entry is a module.
- [ ] **2.2** Split `js/views/plan.js` by responsibility: `plan-list`, `plan-detail`, `plan-schedule-render`, `plan-admin`, `plan-inline-reader` — rendering separated from the domain logic already extracted in 1.2.
- [ ] **2.3** Convert the extracted `js/domain/*` and `js/data/*` to be imported by an ESM entry (`src/main.mjs`); switch `index.html` to a single `<script type="module" src="/src/main.mjs">`. Move remaining not-yet-modularized globals onto an explicit namespace object rather than implicit window globals.
- [ ] **2.4** Introduce Vite (`vite.config.mjs`), replace Phase 0 query-string hashing with Vite's content-hashed filenames, set `vercel.json` `outputDirectory: "dist"`, `buildCommand: "npm run build"` (now `vite build` + config gen). Verify preview deploy boots. Retire `scripts/hash-assets.mjs` and the cache-buster `sw.js`.

### Task 2.5: Gate god-file growth

- [ ] Add an ESLint rule / CI check (`max-lines`) flagging files over ~600 lines so the god files can't silently reappear. Configure `eslint` flat config; commit.

---

## Phase 3 — E2E, Edge Function tests, and full governance

- [ ] **3.1** Playwright smoke test: login (mock/preview) → join plan → mark a chapter read → assert stats increment, run against a Vercel preview + Supabase branch. Add `playwright.yml` triggered on `deployment_status`.
- [ ] **3.2** Deno tests for `supabase/functions/nlc-session` and `nlc-data`: token verification rejects bad tokens; the table/action allowlist blocks disallowed writes. Add a `deno test` CI job.
- [ ] **3.3** Migration governance: CI job that fails a PR if any file under `supabase/migrations/` (not `_legacy`) is modified rather than added; require new sequential numbering.
- [ ] **3.4** `CODEOWNERS` for `supabase/`, `js/data-client/`, `docs/design-system.md`; branch protection requiring the CI + Playwright checks; enforce conventional commits (already the repo convention) with a commitlint check.

---

## Self-Review

- **Spec coverage:** Stale-cache → Phase 0. No safety net → Phase 1 (+ CI in 0.3). Hard to change safely → Phase 1 tests then Phase 2 decomposition + 2.5 guard. Prod-only breakage → 1.1 shim contract + 1.4 shared allowlist + 3.2 Edge tests. Growing-team governance → 0.3, 3.3, 3.4. Covered.
- **Placeholders:** Phase 0 and 1.1 are fully concrete with code. Phases 1.2–3.4 intentionally direct the implementer to *capture real values* from the running code before asserting (characterization testing) rather than inventing expected outputs — this is a deliberate method, not a placeholder. Each such task must be expanded into its own bite-sized plan before execution.
- **Type consistency:** `rewriteAssetVersions(html, resolveHash)`, `buildRequest(table).toRequest()`, `allocateChapters({books, readingDays, level})`, `computeStreak(logs, today)`, `aggregateProgress(logs, plan)` used consistently.
