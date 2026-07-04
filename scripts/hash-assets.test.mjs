import { describe, it, expect } from "vitest";
import { rewriteAssetVersions } from "./hash-assets.mjs";

describe("rewriteAssetVersions", () => {
  const resolve = (p) =>
    ({
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

  it("leaves protocol-relative (//) tags untouched", () => {
    const html = `<script src="//cdn.example.com/lib.js"></script>`;
    expect(rewriteAssetVersions(html, resolve)).toBe(html);
  });

  it("adds ?v= to a local tag that has none", () => {
    const html = `<script src="js/state.js"></script>`;
    const out = rewriteAssetVersions(html, resolve);
    expect(out).toContain('src="js/state.js?v=bbbb2222"');
  });

  it("does not touch non-src/href attributes or unrelated query strings", () => {
    const html = `<img data-path="js/state.js?v=old">`;
    expect(rewriteAssetVersions(html, resolve)).toBe(html);
  });
});
