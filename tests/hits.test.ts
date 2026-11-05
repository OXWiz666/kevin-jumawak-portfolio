import { describe, expect, it } from "vitest";
import {
  createHitRepository,
  getUtcMonthStart,
  parseHitTotals,
} from "@/lib/hits";

describe("hit counter contracts", () => {
  it("normalizes a date into the UTC month start", () => {
    expect(getUtcMonthStart(new Date("2026-10-31T23:30:00-10:00"))).toBe(
      "2026-11-01",
    );
  });

  it("parses a complete non-negative RPC response", () => {
    expect(
      parseHitTotals({
        lifetime_count: 42,
        monthly_count: 7,
        month_start: "2026-10-01",
      }),
    ).toEqual({ lifetime: 42, monthly: 7, month: "2026-10-01" });
  });

  it("rejects malformed RPC values instead of displaying a false count", () => {
    expect(parseHitTotals({ lifetime_count: "42" })).toBeNull();
  });

  it("does not call Supabase when server-only credentials are unavailable", async () => {
    const fetcher = async () => new Response();
    const repository = createHitRepository({ fetcher });

    await expect(repository.get()).resolves.toBeNull();
  });

  it("returns only validated RPC totals from the atomic increment", async () => {
    const fetcher = async () =>
      new Response(
        JSON.stringify([
          {
            lifetime_count: 43,
            monthly_count: 8,
            month_start: "2026-10-01",
          },
        ]),
      );
    const repository = createHitRepository({
      url: "https://example.supabase.co",
      serviceRoleKey: "server-secret",
      fetcher,
    });

    await expect(repository.increment()).resolves.toEqual({
      lifetime: 43,
      monthly: 8,
      month: "2026-10-01",
    });
  });
});
