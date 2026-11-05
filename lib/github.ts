import "server-only";
import { GITHUB_USERNAME, SELECTED_REPOSITORIES } from "@/lib/data";

const REVALIDATE_SECONDS = 43_200;
const GRAPHQL_URL = "https://api.github.com/graphql";
const REST_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=owner&sort=updated&per_page=100`;

export type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};
export type GitHubActivityResult =
  | { kind: "success"; total: number; days: ContributionDay[] }
  | { kind: "unavailable"; reason: "token" | "api" | "invalid" | "empty" };
export type Repository = {
  name: string;
  url: string;
  description: string | null;
};
type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;
type Options = { token?: string; fetcher?: Fetcher };

const query = `query Contributions($login: String!, $from: DateTime!, $to: DateTime!) { user(login: $login) { contributionsCollection(from: $from, to: $to) { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }`;
const levels: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

function isCalendar(value: unknown): value is {
  totalContributions: number;
  weeks: Array<{
    contributionDays: Array<{
      date: string;
      contributionCount: number;
      contributionLevel: string;
    }>;
  }>;
} {
  if (!value || typeof value !== "object") return false;
  const calendar = value as { totalContributions?: unknown; weeks?: unknown };
  return (
    typeof calendar.totalContributions === "number" &&
    Array.isArray(calendar.weeks) &&
    calendar.weeks.every(
      (week) =>
        week &&
        typeof week === "object" &&
        Array.isArray(
          (week as { contributionDays?: unknown }).contributionDays,
        ),
    )
  );
}

export async function loadGitHubActivity({
  token = process.env.GITHUB_TOKEN,
  fetcher = fetch,
}: Options = {}): Promise<GitHubActivityResult> {
  if (!token) return { kind: "unavailable", reason: "token" };
  try {
    const to = new Date();
    const from = new Date(to);
    from.setUTCDate(from.getUTCDate() - 364);
    const response = await fetcher(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: {
          login: GITHUB_USERNAME,
          from: from.toISOString(),
          to: to.toISOString(),
        },
      }),
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return { kind: "unavailable", reason: "api" };
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || "errors" in payload)
      return { kind: "unavailable", reason: "api" };
    const calendar = (
      payload as {
        data?: {
          user?: {
            contributionsCollection?: { contributionCalendar?: unknown };
          };
        };
      }
    ).data?.user?.contributionsCollection?.contributionCalendar;
    if (!isCalendar(calendar))
      return { kind: "unavailable", reason: "invalid" };
    const days = calendar.weeks
      .flatMap((week) => week.contributionDays)
      .filter(
        (day) =>
          typeof day.date === "string" &&
          typeof day.contributionCount === "number" &&
          day.contributionLevel in levels,
      )
      .map((day) => ({
        date: day.date,
        count: day.contributionCount,
        level: levels[day.contributionLevel],
      }));
    return days.length
      ? { kind: "success", total: calendar.totalContributions, days }
      : { kind: "unavailable", reason: "empty" };
  } catch {
    return { kind: "unavailable", reason: "api" };
  }
}

function isRepository(
  value: unknown,
): value is { name: string; html_url: string; description: string | null } {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as { name?: unknown }).name === "string" &&
    typeof (value as { html_url?: unknown }).html_url === "string" &&
    (typeof (value as { description?: unknown }).description === "string" ||
      (value as { description?: unknown }).description === null)
  );
}

export async function loadSelectedRepositories({
  token = process.env.GITHUB_TOKEN,
  fetcher = fetch,
}: Options = {}): Promise<Repository[]> {
  try {
    const response = await fetcher(REST_URL, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return [];
    const payload: unknown = await response.json();
    if (!Array.isArray(payload)) return [];
    return payload
      .filter(isRepository)
      .filter((repository) => SELECTED_REPOSITORIES.includes(repository.name))
      .map((repository) => ({
        name: repository.name,
        url: repository.html_url,
        description: repository.description,
      }));
  } catch {
    return [];
  }
}
