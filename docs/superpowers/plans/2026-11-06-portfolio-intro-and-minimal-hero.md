# Portfolio Intro and Minimal Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a cardless Bryllim-inspired home portrait, monochrome outlined sidebar actions, and an intro gate that prevents first-load content flash.

**Architecture:** A root-layout `beforeInteractive` bootstrap determines whether the home page should play the intro before React hydrates. The home-only client intro component owns the interactive lifecycle while CSS keeps the initial gate opaque. Home markup and sidebar classes are simplified, then final CSS layers establish the portrait and theme-aware outline action system without changing portfolio data or navigation behavior.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, CSS, Motion, Vitest, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-06-portfolio-intro-and-minimal-hero-design.md`

## Global Constraints

- Do not import Bryllim images, copy its copywriting, or add a second profile identity.
- Retain the current local avatar and portfolio content.
- Keep intro behavior limited to `/`; existing template view transitions remain intact.
- Preserve Contact’s copy-email behavior and mailto fallback, along with existing hit-counter and theme behavior.
- Respect `prefers-reduced-motion`; Escape, Enter, Space, and Skip must dismiss a playing intro.
- Do not redesign project pages or alter existing contact/hit-counter data behavior.

## Review Focus

- Cold first load: a fresh Chromium context must see the opaque intro gate before the home hero is visually exposed; covered in Task 1.
- Returning session: `sessionStorage` must bypass the welcome gate; covered in Task 2.
- Reduced motion: users with the OS preference must bypass animation; covered in Task 2.
- Keyboard escape hatch: Escape, Enter, Space, and the Skip button must all leave the intro; covered in Task 2.
- Theme contrast: Contact me, Poke me, footer controls, and sidebar reveal must preserve outline/text contrast in both saved themes; covered in Task 3’s browser style assertions.

---

### Task 1: Establish the browser regression test and Playwright runner

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Create: `playwright.config.ts`
- Create: `tests/e2e/intro.spec.ts`

**Interfaces:**
- Consumes: the development command `npm run dev` and home-page labels/landmarks.
- Produces: `npm run test:e2e` and a reusable Playwright `page` that starts from an unvisited home route.

- [ ] **Step 1: Add `@playwright/test` and the `test:e2e` package script**

Use `playwright test`; configure Chromium and a local Next development server at `http://127.0.0.1:3000` in `playwright.config.ts`.

- [ ] **Step 2: Write the cold-load regression in `tests/e2e/intro.spec.ts`**

```ts
test("covers the home hero before the welcome intro becomes interactive", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("dialog", { name: /portfolio/i })).toBeVisible();
  await expect(page.locator(".home-hero")).not.toBeVisible();
});
```

- [ ] **Step 3: Run the new Playwright test to verify the existing delayed intro fails it**

Run: `npm run test:e2e -- tests/e2e/intro.spec.ts`

Expected: FAIL because the current intro has not mounted at first paint and the hero is visible.

- [ ] **Step 4: Extend the test with the expected release transition**

```ts
await page.getByRole("button", { name: "Skip" }).click();
await expect(page.getByRole("dialog", { name: /portfolio/i })).toBeHidden();
await expect(page.locator(".home-hero")).toBeVisible();
```

- [ ] **Step 5: Commit the failing regression and runner setup**

```bash
git add package.json package-lock.json playwright.config.ts tests/e2e/intro.spec.ts
git commit -m "test: cover first-load intro behavior"
```

### Task 2: Implement the hydration-safe home intro gate

**Files:**
- Create: `lib/intro.ts`
- Modify: `app/layout.tsx`
- Modify: `components/pixel-pet-intro.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Create: `tests/intro.test.ts`
- Modify: `tests/routes.test.ts`

**Interfaces:**
- Consumes: `IntroMode = "play" | "skip"`, `sessionStorage` key `pet-intro-seen`, browser reduced-motion media query, and Task 1’s dialog and `.home-hero` locators.
- Produces: `getIntroMode(options: { pathname: string; hasSeenIntro: boolean; prefersReducedMotion: boolean }): IntroMode`, a `data-intro-mode` document attribute, and a home-only `PixelPetIntro` dialog that begins in its correct initial state.

- [ ] **Step 1: Write failing unit tests for `getIntroMode`**

```ts
expect(getIntroMode({ pathname: "/", hasSeenIntro: false, prefersReducedMotion: false })).toBe("play");
expect(getIntroMode({ pathname: "/", hasSeenIntro: true, prefersReducedMotion: false })).toBe("skip");
expect(getIntroMode({ pathname: "/", hasSeenIntro: false, prefersReducedMotion: true })).toBe("skip");
expect(getIntroMode({ pathname: "/about", hasSeenIntro: false, prefersReducedMotion: false })).toBe("skip");
```

- [ ] **Step 2: Run the focused unit test to verify it fails because the helper does not exist**

Run: `npm test -- tests/intro.test.ts`

Expected: FAIL with a missing module or export error for `getIntroMode`.

- [ ] **Step 3: Implement `getIntroMode` in `lib/intro.ts`**

Return `"play"` only for `/` when there is no seen-session marker and reduced motion is off; return `"skip"` in every other case.

- [ ] **Step 4: Run the focused unit test to verify it passes**

Run: `npm test -- tests/intro.test.ts`

Expected: PASS.

- [ ] **Step 5: Write failing component tests for skip/dismiss controls and initial gate semantics**

Test a playing `PixelPetIntro` by asserting it renders `role="dialog"`, responds to Skip and each supported key, marks the seen session after exit, and applies the root intro marker while playing.

- [ ] **Step 6: Run the component test to verify it fails against the current unguarded lifecycle**

Run: `npm test -- tests/intro.test.ts`

Expected: FAIL because the component currently begins idle and does not expose the bootstrap contract.

- [ ] **Step 7: Implement the pre-hydration gate and client lifecycle**

Add the `beforeInteractive` inline bootstrap only in `app/layout.tsx`; it must call the same decision rules for `/` and set `data-intro-mode` before app hydration. Update `PixelPetIntro` to read that initial decision, render an opaque dialog before its player resolves, persist only after leaving, and remove the marker cleanly. Keep the intro mounted only from `app/page.tsx`.

- [ ] **Step 8: Add the CSS gate contract and run focused unit tests**

The home hero must be visually hidden while `html[data-intro-mode="play"]` is present; the intro dialog must cover the viewport. Use CSS transitions for exit and no animation under reduced motion.

Run: `npm test -- tests/intro.test.ts tests/routes.test.ts`

Expected: PASS; route markup asserts the stable intro/hero identifiers rather than the obsolete portrait-card class.

- [ ] **Step 9: Re-run the Playwright regression to prove the delayed reveal is fixed**

Run: `npm run test:e2e -- tests/e2e/intro.spec.ts`

Expected: PASS; a fresh visit has no exposed hero before Skip and reveals it afterward.

- [ ] **Step 10: Commit the intro gate**

```bash
git add app/layout.tsx app/page.tsx app/globals.css components/pixel-pet-intro.tsx lib/intro.ts tests/intro.test.ts tests/routes.test.ts
git commit -m "fix: gate home content behind intro"
```

### Task 3: Replace the profile card and unify sidebar action styling

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/sidebar.tsx`
- Modify: `app/globals.css`
- Modify: `tests/routes.test.ts`
- Modify: `tests/sidebar.test.tsx`
- Modify: `tests/e2e/intro.spec.ts`

**Interfaces:**
- Consumes: existing `AVATAR_URL`, `DISPLAY_NAME`, `LOCATION`, `Sidebar`, `HitCounter`, and `data-theme` values `light`/`dark`.
- Produces: `.home-portrait--minimal`, `.outline-action`, and the user-visible label `Contact me` while retaining established links/buttons and testable access names.

- [ ] **Step 1: Write failing route and sidebar tests for the revised public structure**

```ts
expect(homeHtml).toContain('class="home-portrait home-portrait--minimal"');
expect(homeHtml).not.toContain("home-portrait-card");
expect(screen.getByRole("button", { name: /contact me/i })).toBeTruthy();
```

- [ ] **Step 2: Run the focused tests to verify they fail against the card-based portrait and old Contact label**

Run: `npm test -- tests/routes.test.ts tests/sidebar.test.tsx`

Expected: FAIL with the old `home-portrait-card` markup and `Contact` label.

- [ ] **Step 3: Simplify the home portrait markup in `app/page.tsx`**

Use a semantic `<figure className="home-portrait home-portrait--minimal">` containing the existing avatar and only minimal editorial metadata. Remove the card wrapper, lower card caption, stamp, and corner decoration.

- [ ] **Step 4: Apply the sidebar action classes and label in `components/sidebar.tsx`**

Apply `.outline-action` to Contact me, the hit button, footer icon links/buttons, and sidebar reveal while preserving every current handler, accessible label, and navigation target.

- [ ] **Step 5: Replace conflicting final portrait/sidebar CSS with one cohesive layer**

Create the monochrome portrait treatment using the existing image, CSS filters, a subtle texture/mask overlay, entrance reveal, and hover shift. Define outline inversion interactions using `var(--ink)` and `var(--surface)` so both themes stay black/white rather than green. Include mobile layout and reduced-motion rules.

- [ ] **Step 6: Run focused tests to verify the structural updates pass**

Run: `npm test -- tests/routes.test.ts tests/sidebar.test.tsx`

Expected: PASS.

- [ ] **Step 7: Extend Playwright coverage for visual state and theme contrast**

In a skipped intro state, assert `.home-portrait--minimal` is visible, `.home-portrait-card` is absent, and each outline action has a visible one-pixel border with foreground/background colors that differ in both `data-theme="light"` and `data-theme="dark"`.

- [ ] **Step 8: Run the browser checks and capture review screenshots**

Run: `npm run test:e2e`

Expected: PASS in Chromium for cold first load, post-skip home, returning session, reduced motion, keyboard dismissal, and both themes.

- [ ] **Step 9: Commit the visual refinement**

```bash
git add app/page.tsx components/sidebar.tsx app/globals.css tests/routes.test.ts tests/sidebar.test.tsx tests/e2e/intro.spec.ts
git commit -m "feat: refine minimal portfolio hero"
```

### Task 4: Run full quality checks

**Files:**
- Modify: none unless a verification failure requires the smallest scoped correction

**Interfaces:**
- Consumes: all changes from Tasks 1–3.
- Produces: verified production build and a concise record of any environment-only limitation.

- [ ] **Step 1: Run the complete unit suite**

Run: `npm test`

Expected: PASS with no unreported failures.

- [ ] **Step 2: Run lint and TypeScript/build validation**

Run: `npm run lint; npx tsc --noEmit; npm run build`

Expected: all commands exit 0.

- [ ] **Step 3: Run the full Playwright suite from a fresh browser context**

Run: `npm run test:e2e`

Expected: PASS with the first-load intro gate and post-skip minimal hero verified.

- [ ] **Step 4: Inspect the final diff and commit any required verification-only correction**

Run: `git diff --check; git status --short`

Expected: no whitespace errors and no unintended generated files.
