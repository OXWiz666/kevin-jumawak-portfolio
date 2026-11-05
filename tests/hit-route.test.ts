import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { createHitRouteHandlers } = await import("@/app/api/hits/route");

const totals = { lifetime: 42, monthly: 7, month: "2026-10-01" };

describe("hit route", () => {
  it("returns an unavailable response when the server repository has no totals", async () => {
    const { GET } = createHitRouteHandlers({
      get: async () => null,
      increment: async () => null,
    });

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ kind: "unavailable" });
  });

  it("returns validated totals from a GET request", async () => {
    const { GET } = createHitRouteHandlers({
      get: async () => totals,
      increment: async () => null,
    });

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ kind: "success", totals });
  });

  it("treats malformed repository output as unavailable instead of returning a false count", async () => {
    const { GET } = createHitRouteHandlers({
      get: async () => ({ lifetime: -1 } as never),
      increment: async () => null,
    });

    const response = await GET();

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ kind: "unavailable" });
  });

  it("increments only through the injected server repository", async () => {
    const { POST } = createHitRouteHandlers({
      get: async () => null,
      increment: async () => totals,
    });

    const response = await POST();

    expect(response.status).toBe(200);
    expect(response.headers.get("Cache-Control")).toBe("no-store");
    await expect(response.json()).resolves.toEqual({ kind: "success", totals });
  });
});
