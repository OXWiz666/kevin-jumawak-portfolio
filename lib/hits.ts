export type HitTotals = {
  lifetime: number;
  monthly: number;
  month: string;
};

type RpcHitTotals = {
  lifetime_count: unknown;
  monthly_count: unknown;
  month_start: unknown;
};

type Fetcher = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>;

type RepositoryOptions = {
  url?: string;
  serviceRoleKey?: string;
  fetcher?: Fetcher;
};

export type HitRepository = {
  get(): Promise<HitTotals | null>;
  increment(): Promise<HitTotals | null>;
};

const MONTH_START = /^\d{4}-(0[1-9]|1[0-2])-01$/;

export function getUtcMonthStart(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-01`;
}

export function parseHitTotals(value: unknown): HitTotals | null {
  if (!value || typeof value !== "object") return null;

  const totals = value as RpcHitTotals;
  const lifetimeCount = totals.lifetime_count;
  const monthlyCount = totals.monthly_count;
  if (
    typeof lifetimeCount !== "number" ||
    typeof monthlyCount !== "number" ||
    !Number.isSafeInteger(lifetimeCount) ||
    !Number.isSafeInteger(monthlyCount) ||
    lifetimeCount < 0 ||
    monthlyCount < 0 ||
    typeof totals.month_start !== "string" ||
    !MONTH_START.test(totals.month_start)
  ) {
    return null;
  }

  return {
    lifetime: lifetimeCount,
    monthly: monthlyCount,
    month: totals.month_start,
  };
}

export function isHitTotals(value: unknown): value is HitTotals {
  if (!value || typeof value !== "object") return false;
  const totals = value as HitTotals;
  return (
    Number.isSafeInteger(totals.lifetime) &&
    Number.isSafeInteger(totals.monthly) &&
    totals.lifetime >= 0 &&
    totals.monthly >= 0 &&
    typeof totals.month === "string" &&
    MONTH_START.test(totals.month)
  );
}

function parseRpcPayload(value: unknown): HitTotals | null {
  return parseHitTotals(Array.isArray(value) ? value[0] : value);
}

export function createHitRepository({
  url = process.env.SUPABASE_URL,
  serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY,
  fetcher = fetch,
}: RepositoryOptions = {}) {
  async function call(functionName: string): Promise<HitTotals | null> {
    if (!url || !serviceRoleKey) return null;

    try {
      const response = await fetcher(
        `${url.replace(/\/$/, "")}/rest/v1/rpc/${functionName}`,
        {
          method: "POST",
          headers: {
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ target_month: getUtcMonthStart(new Date()) }),
          cache: "no-store",
        },
      );
      if (!response.ok) return null;
      return parseRpcPayload(await response.json());
    } catch {
      return null;
    }
  }

  return {
    get: () => call("get_portfolio_hit_totals"),
    increment: () => call("increment_portfolio_hit"),
  } satisfies HitRepository;
}
