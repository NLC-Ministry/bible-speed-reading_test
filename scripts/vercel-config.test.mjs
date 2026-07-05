// scripts/vercel-config.test.mjs
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const cfg = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));

// Look up a header rule by exact source string, return its Cache-Control value.
// NOTE: JSON "/(.*)\\.js" parses to the JS string /(.*)\.js.
//       JS string literal "/(.*)\\.js" also equals /(.*)\.js (\\→\).
//       Both sides must use the same literal so this find() succeeds.
const headerFor = (source) => {
  const rule = cfg.headers.find((h) => h.source === source);
  return rule ? rule.headers.find((x) => x.key === "Cache-Control")?.value : undefined;
};

describe("vercel.json", () => {
  it("outputs the dist directory", () => {
    expect(cfg.outputDirectory).toBe("dist");
  });

  it("keeps entry HTML uncacheable", () => {
    expect(headerFor("/")).toContain("no-store");
    expect(headerFor("/index.html")).toContain("no-store");
  });

  it("marks hashed JS assets immutable and long-lived", () => {
    const jsVal = headerFor("/(.*)\\.js");
    expect(jsVal).toBeDefined();
    expect(jsVal).toContain("immutable");
    expect(jsVal).toContain("max-age=31536000");
  });

  it("marks hashed CSS assets immutable and long-lived", () => {
    const cssVal = headerFor("/(.*)\\.css");
    expect(cssVal).toBeDefined();
    expect(cssVal).toContain("immutable");
    expect(cssVal).toContain("max-age=31536000");
  });

  it("drops the removed config.js and sw.js header rules", () => {
    expect(cfg.headers.some((h) => h.source === "/config.js")).toBe(false);
    expect(cfg.headers.some((h) => h.source === "/sw.js")).toBe(false);
  });
});
