import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const { loadGitHubActivity, loadSelectedRepositories } = await import(
  "@/lib/github"
);

describe("GitHub server data", () => {
  it("does not fetch protected activity without a token", async () => {
    const fetcher = vi.fn();
    await expect(
      loadGitHubActivity({ token: undefined, fetcher }),
    ).resolves.toEqual({ kind: "unavailable", reason: "token" });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("maps a valid GraphQL calendar into daily contribution cells", async () => {
    const payload = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 12,
              weeks: [
                {
                  contributionDays: [
                    {
                      date: "2026-01-01",
                      contributionCount: 3,
                      contributionLevel: "SECOND_QUARTILE",
                    },
                  ],
                },
              ],
            },
          },
        },
      },
    };
    const fetcher = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify(payload)));
    await expect(
      loadGitHubActivity({ token: "test", fetcher }),
    ).resolves.toEqual({
      kind: "success",
      total: 12,
      days: [{ date: "2026-01-01", count: 3, level: 2 }],
    });
  });

  it("does not mistake GraphQL errors for an empty calendar", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: "rate limit" }] }), {
        status: 200,
      }),
    );
    await expect(
      loadGitHubActivity({ token: "test", fetcher }),
    ).resolves.toEqual({ kind: "unavailable", reason: "api" });
  });

  it("keeps only configured public repository names", async () => {
    const fetcher = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            name: "ai-bayanihan-challenge",
            html_url: "https://github.com/OXWiz666/ai-bayanihan-challenge",
            description: "AI challenge project",
          },
          {
            name: "other",
            html_url: "https://github.com/OXWiz666/other",
            description: null,
          },
        ]),
      ),
    );
    await expect(loadSelectedRepositories({ fetcher })).resolves.toEqual([
      {
        name: "ai-bayanihan-challenge",
        url: "https://github.com/OXWiz666/ai-bayanihan-challenge",
        description: "AI challenge project",
      },
    ]);
  });
});
