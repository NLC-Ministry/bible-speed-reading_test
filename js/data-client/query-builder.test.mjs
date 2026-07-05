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

  it("exposes exactly the supported operator surface", () => {
    const b = buildRequest("t");
    const ops = ["select","insert","update","delete","upsert","eq","is","in","or","order","limit","single","maybeSingle"];
    ops.forEach((op) => expect(typeof b[op]).toBe("function"));
  });

  it("insert produces action:insert with payload set and filters:[]", () => {
    const payload = { user_id: "abc", book: "Genesis", chapter: 1 };
    const req = buildRequest("reading_logs").insert(payload).toRequest();
    expect(req).toEqual({
      table: "reading_logs",
      action: "insert",
      payload,
      filters: [],
    });
  });

  it("upsert with options produces action:upsert, payload, and options", () => {
    const payload = { id: "abc", name: "John" };
    const options = { onConflict: "id" };
    const req = buildRequest("profiles").upsert(payload, options).toRequest();
    expect(req.action).toBe("upsert");
    expect(req.payload).toEqual(payload);
    expect(req.options).toEqual(options);
  });

  it("order with no options defaults ascending to true", () => {
    const req = buildRequest("reading_logs").order("read_at").toRequest();
    expect(req.order).toEqual({ column: "read_at", ascending: true });
  });

  it("in filter pushes { type:'in', column, value }", () => {
    const values = ["Genesis", "Exodus"];
    const req = buildRequest("reading_logs").in("book", values).toRequest();
    expect(req.filters).toEqual([{ type: "in", column: "book", value: values }]);
  });
});
