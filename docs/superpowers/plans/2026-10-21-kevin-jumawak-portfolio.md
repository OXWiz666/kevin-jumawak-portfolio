# Kevin Jumawak Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Kevin Jumawak’s responsive, source-faithful Next.js portfolio with honest local content and cached GitHub activity.

**Architecture:** The App Router shell copies the portfolio skill’s plain-CSS presentation system and client-only interaction components. Typed portfolio data supplies all static pages, while a server-only GitHub adapter fetches and validates GraphQL contributions plus REST repository data with a 12-hour cache. Pages use server components unless browser state is genuinely necessary.

**Tech Stack:** Next.js App Router, React, TypeScript strict mode, plain CSS, Lenis, Vitest, GitHub GraphQL API, GitHub REST API.

**Spec:** `docs/superpowers/specs/2026-10-21-kevin-jumawak-portfolio-design.md`

## Global Constraints

- Preserve the supplied `portfolio-skill.md` design tokens, class names, breakpoints, DOM patterns, and interaction behaviors.
- Use no Tailwind, database, gradients beyond the skill’s monochrome surface treatment, or excluded product features.
- Keep all unknown professional/project details visibly unavailable; never fabricate them.
- Use `alphadaryl0425@gmail.com` for copy-email and `mailto:` interactions.
- Use `OXWiz666` as the GitHub username; never expose `GITHUB_TOKEN` client-side.
- Cache GitHub GraphQL and REST requests for exactly 43,200 seconds; validate runtime response shapes and degrade without errors.
- Respect `prefers-reduced-motion`; maintain keyboard and screen-reader access.

## Review Focus

- Missing `GITHUB_TOKEN` must produce an explanatory empty GitHub state without calling a protected endpoint or failing the page.
- GitHub’s GraphQL error/rate-limit response must not be mistaken for a valid, empty contribution calendar.
- A contribution week with fewer than seven cells must render safely and retain a text description for each available day.
- Project entries with no screenshot or external URL must display neutral unavailable content without broken images or inaccessible links.
- The mobile sidebar must be unavailable on subpages while Home retains an accessible drawer and no horizontal overflow.

---

### Task 1: Bootstrap the strict Next.js application and source-fidelity shell

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `next-env.d.ts`, `eslint.config.mjs`, `vitest.config.ts`, `.env.example`
- Create: `app/layout.tsx`, `app/globals.css`, `app/icon.svg`, `app/not-found.tsx`
- Create: `components/icons.tsx`, `components/page.tsx`, `components/sidebar.tsx`, `components/pixel-name.tsx`, `components/click-burst.tsx`, `components/copy-email.tsx`
- Create: `lib/data.ts`
- Test: `tests/data.test.ts`

**Interfaces:**
- Produces: the shared `Page`, `PageHeader`, `Sidebar`, `PixelName`, `CopyEmail`, `NavIcons`, and typed data exports used by every later task.
- Consumes: the exact design system and source-file behavior in `portfolio-skill.md`.

- [ ] **Step 1: Write the failing portfolio-data invariant tests**

```ts
import { EMAIL, GITHUB_USERNAME, PROJECTS } from "@/lib/data";

test("contains only portfolio projects with unique slugs and the supplied contact identity", () => {
  expect(EMAIL).toBe("alphadaryl0425@gmail.com");
  expect(GITHUB_USERNAME).toBe("OXWiz666");
  expect(new Set(PROJECTS.map((project) => project.slug)).size).toBe(PROJECTS.length);
});
```

- [ ] **Step 2: Run the invariant test to verify it fails**

Run: `npm test -- tests/data.test.ts`

Expected: FAIL because the application and `lib/data.ts` do not exist.

- [ ] **Step 3: Scaffold strict Next.js and implement the shared interface exports**

Create a no-`src/` App Router project with `@/*` aliases, Vitest, Lenis, strict compiler options, and `.env.example` containing only `GITHUB_TOKEN=`. Copy the source skill’s CSS and shared components, then remove Poke, sample blog/services/gear/links/resource navigation, and all sample data. `lib/data.ts` must export the typed constants named by this task’s test.

- [ ] **Step 4: Run the focused test to verify it passes**

Run: `npm test -- tests/data.test.ts`

Expected: PASS.

- [ ] **Step 5: Run formatting-safe static checks**

Run: `npm run lint && npx tsc --noEmit`

Expected: both commands exit 0.

### Task 2: Implement typed server-only GitHub data access

**Files:**
- Create: `lib/github.ts`
- Create: `components/contributions.tsx`
- Test: `tests/github.test.ts`
- Modify: `lib/data.ts`

**Interfaces:**
- Produces: `loadGitHubActivity(): Promise<GitHubActivityResult>` and `loadSelectedRepositories(): Promise<RepositoryResult>` for server components.
- Consumes: `GITHUB_USERNAME`, a server-only `GITHUB_TOKEN`, `fetch`, and selected repository names from `lib/data.ts`.

- [ ] **Step 1: Write failing validation and fallback tests**

```ts
test("returns token-unavailable without fetching when no token is configured", async () => {
  await expect(loadGitHubActivity({ token: undefined, fetcher })).resolves.toEqual({ kind: "unavailable", reason: "token" });
  expect(fetcher).not.toHaveBeenCalled();
});

test("maps a valid GraphQL contribution calendar into daily cells", async () => {
  await expect(loadGitHubActivity({ token: "test", fetcher: validGraphqlFetcher })).resolves.toMatchObject({ kind: "success", total: 12 });
});
```

- [ ] **Step 2: Run GitHub tests to verify they fail**

Run: `npm test -- tests/github.test.ts`

Expected: FAIL because `lib/github.ts` does not exist.

- [ ] **Step 3: Implement validated cached GraphQL and REST loaders**

Implement explicit response guards for GraphQL data/errors and REST arrays. Set `next: { revalidate: 43_200 }` on both requests. GraphQL obtains `contributionsCollection` daily cells and yearly total; REST returns only explicitly selected repositories. Model unavailable, rate-limit, HTTP, invalid-response, and empty states as discriminated unions. Keep token access inside the module with `import "server-only"`.

- [ ] **Step 4: Implement the grayscale, accessible contributions server component**

Render successful activity as 52 source-style grayscale week columns. Each day must have a focusable element and an accessible count/date label. Render an explanatory source-style empty state for all non-success results and selected repositories only when present.

- [ ] **Step 5: Run focused GitHub tests to verify they pass**

Run: `npm test -- tests/github.test.ts`

Expected: PASS.

- [ ] **Step 6: Run the complete test suite**

Run: `npm test`

Expected: PASS with all data and GitHub tests.

### Task 3: Build the Home, About, Experience, Stack, and Contact routes

**Files:**
- Create: `app/page.tsx`, `app/about/page.tsx`, `app/experience/page.tsx`, `app/stack/page.tsx`, `app/contact/page.tsx`
- Create: `components/experience-list.tsx`, `components/photo-stack.tsx`
- Modify: `lib/data.ts`, `app/globals.css`
- Test: `tests/routes.test.tsx`

**Interfaces:**
- Consumes: Task 1 shared shell/data and Task 2 `Contributions`.
- Produces: the non-project required route components and responsive source-style sections.

- [ ] **Step 1: Write failing route-content tests**

```tsx
test("home presents the supplied headline and contact route", async () => {
  const page = await Home();
  expect(renderToStaticMarkup(page)).toContain("I build software that solves real problems.");
  expect(renderToStaticMarkup(page)).toContain("/contact");
});

test("experience presents the supplied internship organization", () => {
  expect(renderToStaticMarkup(<ExperiencePage />)).toContain("STI College General Santos");
});
```

- [ ] **Step 2: Run route tests to verify they fail**

Run: `npm test -- tests/routes.test.tsx`

Expected: FAIL because required routes do not exist.

- [ ] **Step 3: Implement the content routes with exact source classes and honest data**

Use `Page`/`PageHeader`, source-style rows, photo-stack placeholders, expandable experience details, stack categories, and a contact copy-email action. Add the responsive classes only where source CSS lacks a required component style. Do not add a contact form or unsupported professional links.

- [ ] **Step 4: Run route tests to verify they pass**

Run: `npm test -- tests/routes.test.tsx`

Expected: PASS.

- [ ] **Step 5: Verify typing and linting**

Run: `npm run lint && npx tsc --noEmit`

Expected: both commands exit 0.

### Task 4: Implement project lists and robust project-detail pages

**Files:**
- Create: `app/projects/page.tsx`, `app/projects/[slug]/page.tsx`
- Create: `components/project-list.tsx`, `components/carousel.tsx`, `components/project-detail-section.tsx`
- Modify: `lib/data.ts`, `app/globals.css`
- Test: `tests/projects.test.tsx`

**Interfaces:**
- Consumes: `Project` data from Task 1 and source list/carousel styles.
- Produces: static project paths, projects index, detail route, and unavailable-content handling.

- [ ] **Step 1: Write failing project tests**

```tsx
test("lists ForgeKeep Wallet as in development", () => {
  expect(renderToStaticMarkup(<ProjectsPage />)).toContain("ForgeKeep Wallet");
  expect(renderToStaticMarkup(<ProjectsPage />)).toContain("In Development");
});

test("renders a readable unavailable section when project evidence is absent", async () => {
  const html = renderToStaticMarkup(await ProjectPage({ params: Promise.resolve({ slug: "draftiq" }) }));
  expect(html).toContain("Not publicly available yet");
});
```

- [ ] **Step 2: Run project tests to verify they fail**

Run: `npm test -- tests/projects.test.tsx`

Expected: FAIL because the project routes and components do not exist.

- [ ] **Step 3: Implement project type extensions and source-style project views**

Model project status, optional assets/URLs, technical sections, and factual fallback copy in `lib/data.ts`. Build source-fidelity list rows, a native scroll-snap gallery only when evidence exists, and detail sections that use a neutral unavailable state for missing facts. Add `generateStaticParams`, `generateMetadata`, and `notFound()` behavior.

- [ ] **Step 4: Run focused project tests to verify they pass**

Run: `npm test -- tests/projects.test.tsx`

Expected: PASS.

- [ ] **Step 5: Run the full suite**

Run: `npm test`

Expected: PASS.

### Task 5: Production verification and visual QA

**Files:**
- Modify: `README.md`
- Modify: source files only where verification reveals concrete defects

**Interfaces:**
- Consumes: the full app from Tasks 1–4.
- Produces: a documented environment setup and validated production build.

- [ ] **Step 1: Write the GitHub setup documentation expectation**

Add a README section naming `GITHUB_TOKEN`, its server-only contribution-calendar purpose, its 12-hour revalidation, and expected graceful behavior without it.

- [ ] **Step 2: Run the complete local validation set**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: every command exits 0.

- [ ] **Step 3: Perform browser QA at the required presentations**

Run: `npm run dev`

Expected: Home at 1200px and 390px works in light/dark modes; copy-email provides feedback; mobile drawer is home-only; project fallback content is readable; reduced motion removes decorative animation; there is no horizontal page overflow.

- [ ] **Step 4: Re-run the production build after any browser-QA fixes**

Run: `npm run build`

Expected: exit 0.
