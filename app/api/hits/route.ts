import "server-only";
import {
  createHitRepository,
  isHitTotals,
  type HitRepository,
  type HitTotals,
} from "@/lib/hits";

export const dynamic = "force-dynamic";

type HitSuccess = { kind: "success"; totals: HitTotals };
type HitUnavailable = { kind: "unavailable" };
type HitResponse = HitSuccess | HitUnavailable;

function json(payload: HitResponse, status: number, cacheControl: string) {
  return Response.json(payload, {
    status,
    headers: { "Cache-Control": cacheControl },
  });
}

export function createHitRouteHandlers(repository: HitRepository) {
  async function respond(getTotals: () => Promise<HitTotals | null>, cache: string) {
    const totals = await getTotals();
    return isHitTotals(totals)
      ? json({ kind: "success", totals }, 200, cache)
      : json({ kind: "unavailable" }, 503, cache);
  }

  return {
    GET: () => respond(() => repository.get(), "public, max-age=60, s-maxage=60"),
    POST: () => respond(() => repository.increment(), "no-store"),
  };
}

export async function GET() {
  return createHitRouteHandlers(createHitRepository()).GET();
}

export async function POST() {
  return createHitRouteHandlers(createHitRepository()).POST();
}
