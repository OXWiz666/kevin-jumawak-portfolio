# Shared Hit Counter and ForgeKeep Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a secure shared monthly hit counter and deliver the approved homepage, sidebar, and ForgeKeep portfolio redesign.

**Architecture:** The global counter uses two private Supabase tables and a single atomic RPC invoked only through a server-side Next.js route. A focused client `HitCounter` component owns display, optimistic-safe refresh, local cooldown, aria-live updates, and the animation state; the sidebar composes it. Homepage and ForgeKeep content remain static data-driven React Server Components using verified local/official assets.

**Tech Stack:** Next.js App Router, TypeScript strict mode, React, plain CSS, Vitest, Supabase Postgres RPC, native `fetch`.

**Spec:** `docs/superpowers/specs/2026-10-21-shared-hit-counter-home-forgekeep-design.md`

## Global Constraints

- Preserve the floating-sidebar, monochrome editorial design system and its original light/dark tokens.
- Keep Supabase credentials server-only; never create a `NEXT_PUBLIC_` service-role variable.
- Enable RLS on all exposed Supabase tables and allow no direct browser access to counter rows.
- Collect no visitor identity, email address, IP address, or event log for the counter.
- Use verified resume and official ForgeKeep content only; do not invent product metrics, customer claims, screenshots, challenges, or achievements.
- All motion must respect `prefers-reduced-motion`.
- Keep the desktop content cap at approximately 920px and collapse the hero cleanly to one column on smaller viewports.

## Review Focus

- Missing Supabase environment variables return an unavailable counter state without exposing server configuration; covered in Task 2 route tests.
- Two concurrent increments must not lose a hit; covered by a SQL RPC verification query in Task 1.
- A malformed Supabase RPC response must not render a false count; covered in Task 2 response-validation tests.
- Rapid repeated presses from the same browser must not send requests during the cooldown; covered in Task 3 client interaction tests.
- Official ForgeKeep visual assets failing to load must leave an accessible visual fallback; covered in Task 5 static rendering tests.

---

## File Structure

- `supabase/migrations/<timestamp>_portfolio_hit_counts.sql` — private tables, atomic RPC, RLS, and grants.
- `lib/hits.ts` — shared `HitTotals` validation, month derivation, unavailable states, and server-side RPC client factory.
- `app/api/hits/route.ts` — GET and POST handlers; receives a small injected service boundary in tests.
- `components/hit-counter.tsx` — client-owned fetch, cooldown, accessible count text, and hammer animation state.
- `components/sidebar.tsx` — composes `HitCounter`, keeps the mobile drawer close action, and positions the monthly statistic above the footer.
- `app/page.tsx` — redesigned factual homepage hero and project presentation.
- `components/forgekeep-mark.tsx` — resilient logo/preview component with accessible fallback state.
- `lib/data.ts` — verified ForgeKeep copy, asset URLs, technology list, and screenshot metadata.
- `app/projects/[slug]/page.tsx` and `components/project-list.tsx` — render ForgeKeep’s richer visual and detail presentation.
- `app/globals.css` — shared responsive layout, compact counter animation, hero, project mark, and reduced-motion styles.
- `tests/hits.test.ts`, `tests/hit-route.test.ts`, `tests/hit-counter.test.tsx`, `tests/projects.test.ts`, `tests/routes.test.ts` — behavioral coverage.
- `.env.example` — server-only Supabase environment variable documentation.

### Task 1: Supabase counter schema and shared counter contracts

**Files:**
- Create: `supabase/migrations/<timestamp>_portfolio_hit_counts.sql`
- Create: `lib/hits.ts`
- Create: `tests/hits.test.ts`
- Modify: `.env.example`

**Interfaces:**
- Produces: `type HitTotals = { lifetime: number; monthly: number; month: string }`.
- Produces: `function getUtcMonthStart(date: Date): string`.
- Produces: `function parseHitTotals(value: unknown): HitTotals | null`.
- Produces: `function createHitRepository(input: { url?: string; serviceRoleKey?: string; fetcher?: typeof fetch }): { get(): Promise<HitTotals | null>; increment(): Promise<HitTotals | null> }`.

- [ ] **Step 1: Write failing unit tests for hit value parsing and UTC month normalization**

```ts
expect(getUtcMonthStart(new Date("2026-10-31T23:30:00-10:00"))).toBe("2026-11-01");
expect(parseHitTotals({ lifetime_count: 42, monthly_count: 7, month_start: "2026-10-01" })).toEqual({ lifetime: 42, monthly: 7, month: "2026-10-01" });
expect(parseHitTotals({ lifetime_count: "42" })).toBeNull();
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- tests/hits.test.ts`

Expected: FAIL because `lib/hits.ts` does not exist.

- [ ] **Step 3: Implement the pure contracts in `lib/hits.ts`**

`getUtcMonthStart` must return an ISO `YYYY-MM-01` key. `parseHitTotals` accepts only finite non-negative number values and an ISO month string. The repository factory must make server-side REST RPC calls to `increment_portfolio_hit` and return `null` when configuration or responses are unavailable/invalid.

- [ ] **Step 4: Add the Supabase migration**

Create `portfolio_hit_totals` with its singleton lifetime counter and `portfolio_monthly_hits` keyed by month. Enable RLS on both tables with no browser policies. Add a transaction-safe `increment_portfolio_hit(target_month date default date_trunc('month', now() at time zone 'utc')::date)` function that updates the lifetime row and monthly row and returns `lifetime_count`, `monthly_count`, and `month_start`. Revoke public execution; grant only the server role required by the server-side REST call.

- [ ] **Step 5: Document server-only environment values**

Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` placeholders plus a warning that neither belongs in a `NEXT_PUBLIC_` key.

- [ ] **Step 6: Run focused tests and Supabase verification**

Run: `npm test -- tests/hits.test.ts`

Expected: PASS.

When the Supabase project is connected, apply the migration, call the RPC twice, and verify the returned lifetime total increases twice while the same month total increases twice.

### Task 2: Server-only hits route

**Files:**
- Create: `app/api/hits/route.ts`
- Create: `tests/hit-route.test.ts`
- Modify: `lib/hits.ts`

**Interfaces:**
- Consumes: `createHitRepository(...)` and `HitTotals` from Task 1.
- Produces: `GET /api/hits` and `POST /api/hits` JSON responses of `{ kind: "success", totals: HitTotals }` or `{ kind: "unavailable" }`.

- [ ] **Step 1: Write failing route tests for unavailable GET, successful GET, successful POST, and malformed repository output**

```ts
expect(await GET()).toMatchObject({ status: 503 });
expect(await POST()).toMatchObject({ status: 200 });
```

Use an injected repository factory so tests do not access real environment variables or Supabase.

- [ ] **Step 2: Run the focused route tests to verify failure**

Run: `npm test -- tests/hit-route.test.ts`

Expected: FAIL because the route is absent.

- [ ] **Step 3: Implement GET and POST handlers in `app/api/hits/route.ts`**

Create the repository only on the server. Return `Cache-Control: no-store` for POST and a short revalidation-safe cache policy for GET. Return 503 with `{ kind: "unavailable" }` when the repository produces no valid totals.

- [ ] **Step 4: Run the route tests to verify they pass**

Run: `npm test -- tests/hit-route.test.ts`

Expected: PASS.

### Task 3: Compact accessible HitCounter component

**Files:**
- Create: `components/hit-counter.tsx`
- Create: `tests/hit-counter.test.tsx`
- Modify: `components/sidebar.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `/api/hits` response contract from Task 2.
- Produces: `function HitCounter(): JSX.Element`.
- Produces: sidebar markup that places `Hit this month` above `.sidebar-foot`.

- [ ] **Step 1: Write failing component tests for loading, unavailable, success, and press cooldown states**

```tsx
expect(screen.getByRole("button", { name: /hit me/i })).toHaveTextContent("42");
await user.click(screen.getByRole("button", { name: /hit me/i }));
expect(fetchMock).toHaveBeenCalledTimes(1);
await user.click(screen.getByRole("button", { name: /hit me/i }));
expect(fetchMock).toHaveBeenCalledTimes(1);
```

- [ ] **Step 2: Run the focused component tests to verify failure**

Run: `npm test -- tests/hit-counter.test.tsx`

Expected: FAIL because the component is absent.

- [ ] **Step 3: Implement `HitCounter`**

Fetch GET once after mount. On press, POST only when not loading/cooling down; update state from the server response and set a local cooldown timestamp. Render count text, current-month text, and an `aria-live="polite"` update. Apply `is-hit` for hammer swing, impact burst, and the increment label rising inside the button. Do not animate under reduced motion.

- [ ] **Step 4: Replace the sidebar’s local hit state with `HitCounter`**

Remove the prior local-only hammer count logic. Retain the icon close button and call `setOpen(false)` through a named `closeDrawer` handler so both scrim and close button use the same path.

- [ ] **Step 5: Add compact counter and drawer styles**

Make the control smaller than the existing contact CTA, put the current-month stat directly above the footer, and provide explicit visible hover, focus, pressed, unavailable, and reduced-motion styles.

- [ ] **Step 6: Run focused component tests to verify success**

Run: `npm test -- tests/hit-counter.test.tsx`

Expected: PASS.

### Task 4: Homepage hero redesign and responsive shared visual system

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/routes.test.ts`

**Interfaces:**
- Consumes: `AVATAR_URL`, verified identity data, `ABOUT_SUMMARY`, and project data from `lib/data.ts`.
- Produces: the `Home` route hero with `home-hero`, `home-portrait`, and `home-profile` semantic class names.

- [ ] **Step 1: Write failing static route tests for the factual hero details and portrait**

```ts
expect(html).toContain('class="home-hero"');
expect(html).toContain("BS Information Technology");
expect(html).toContain('src="/images/kevin-jumawak-avatar.jfif"');
```

- [ ] **Step 2: Run the homepage route test to verify failure**

Run: `npm test -- tests/routes.test.ts`

Expected: FAIL because the new semantic hero structure is absent.

- [ ] **Step 3: Implement the factual two-column homepage hero**

Use a 240–280px framed portrait, role/location, concise verified summary, availability/contact action, education, and focus. Do not add numeric achievement cards. Keep selected projects, stack, and GitHub below the hero.

- [ ] **Step 4: Add responsive shared CSS**

Set `--col` near 920px, use a two-column hero above the tablet breakpoint, and stack it below the breakpoint. Refine shared spacing, section rhythm, and tactile hover/press behavior while keeping grayscale tokens and low-motion fallback.

- [ ] **Step 5: Run the homepage route tests to verify success**

Run: `npm test -- tests/routes.test.ts`

Expected: PASS.

### Task 5: ForgeKeep visual identity and verified project detail

**Files:**
- Create: `components/forgekeep-mark.tsx`
- Modify: `lib/data.ts`
- Modify: `components/project-list.tsx`
- Modify: `app/projects/[slug]/page.tsx`
- Modify: `app/globals.css`
- Modify: `tests/projects.test.ts`

**Interfaces:**
- Produces: `function ForgeKeepMark({ variant }: { variant: "row" | "hero" }): JSX.Element`.
- Produces: ForgeKeep project data with official logo URL, official Open Graph preview URL, verified stack, feature list, and live site URL.

- [ ] **Step 1: Write failing project tests for official ForgeKeep visual metadata and content**

```ts
expect(forgeKeep.images).toContain("https://www.forgekeep.online/opengraph-image");
expect(forgeKeep.technologies).toEqual(expect.arrayContaining(["Next.js", "Supabase", "PostgreSQL", "Prisma", "Hono.js"]));
expect(renderedProject).toContain("Boss schedules");
```

- [ ] **Step 2: Run project tests to verify failure**

Run: `npm test -- tests/projects.test.ts`

Expected: FAIL because the current data has placeholders and no mark component.

- [ ] **Step 3: Implement `ForgeKeepMark` with a resilient fallback**

Render the official logo with descriptive alt text. On image error, present a text mark and preserve the accessible project name.

- [ ] **Step 4: Replace ForgeKeep placeholders with verified data**

Use the official site and supplied resume to document boss schedules, attendance, members, loot/inventory, DKP, accounting, Discord operations, OCR attendance automation, real-time synchronization, and the verified technical stack. Keep unknown challenge/lesson sections explicit rather than fabricated.

- [ ] **Step 5: Render the mark and preview**

Show the mark in the project list and the official Open Graph visual as a labelled preview on the project detail page. Retain the live website link.

- [ ] **Step 6: Run project tests to verify success**

Run: `npm test -- tests/projects.test.ts`

Expected: PASS.

### Task 6: Full verification and configuration handoff

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: all earlier components, route contract, migration, and documented environment variables.
- Produces: concise setup instructions for the migration and server-only environment values.

- [ ] **Step 1: Document the global-counter setup**

Explain how to apply the migration, set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, and verify `GET /api/hits`. Explicitly state that the site shows an unavailable count until those values are configured.

- [ ] **Step 2: Run the complete verification suite**

Run: `npm test && npm run lint && npx tsc --noEmit && npm run build`

Expected: all tests pass, no lint/type errors, and the production build succeeds.

- [ ] **Step 3: Run visual regression checks in the local preview**

Verify desktop and mobile hero layouts, mobile drawer close action, hammer press/count-flight behavior, monthly statistic placement, unavailable counter state, dark mode, reduced-motion mode, ForgeKeep mark fallback, and ForgeKeep detail visual.

## Plan self-review

- Spec coverage: Tasks 1–3 implement the durable global counter and accessibility/resilience requirements; Task 4 covers the homepage and responsive presentation; Task 5 covers ForgeKeep assets and verified content; Task 6 covers setup and full verification.
- Step scan: each task begins with a focused failing test, then has a single implementation target and a specific check.
- Type consistency: `HitTotals`, `createHitRepository`, and the API response contract are defined before the route and client tasks consume them.
- Review focus: every listed failure mode has an explicit test or SQL verification step in its owning task.
- Proportion: the plan documents interfaces and tests rather than implementing component bodies.
