// Content-based cache-busting for the buildless app.
//
// The app loads its own JS/CSS via classic <script>/<link> tags carrying a
// hand-maintained `?v=YYYYMMDD` query string (see index.html). Forgetting to
// bump one ships a stale mix of old/new files to members' phones. This script
// replaces the hand-typed version with an 8-char hash of each file's contents,
// so the version changes automatically if and only if the file changes.
//
// It intentionally does NOT rename files or add `type="module"` — global-script
// semantics and load order are preserved. Only `?v=` query strings are rewritten.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

// Matches src="X" / href="X" where X is a local path (not http(s):, not
// protocol-relative //), optionally already carrying a ?v=... query string.
const ATTR_RE = /(src|href)="(?!https?:|\/\/)([^"?#]+)(?:\?v=[^"#]*)?"/g;

/**
 * Rewrite `?v=` versions on local asset tags to their content hash.
 * @param {string} html
 * @param {(relPath: string) => string | null} resolveHash returns the hash for a
 *   repo-relative path, or null to leave the tag unchanged.
 * @returns {string}
 */
export function rewriteAssetVersions(html, resolveHash) {
  return html.replace(ATTR_RE, (match, attr, path) => {
    const hash = resolveHash(path);
    if (!hash) return match;
    return `${attr}="${path}?v=${hash}"`;
  });
}

/** sha256 (first 8 hex chars) of a file's contents. */
export function hashFile(absPath) {
  const buf = readFileSync(absPath);
  return createHash("sha256").update(buf).digest("hex").slice(0, 8);
}

// CLI: rewrite index.html in place using real file hashes.
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
