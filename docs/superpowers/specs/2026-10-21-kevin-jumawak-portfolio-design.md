# Kevin Jumawak Portfolio Design

## Purpose

Build a production-ready personal developer portfolio for Lord Kevin Francis G. Jumawak. It should give prospective collaborators a concise, credible view of Kevin's work, technical focus, experience, education, and public GitHub activity, while preserving the exact visual system supplied in `portfolio-skill.md`.

## Product Scope

The site is a Next.js App Router application written in strict TypeScript. It uses plain CSS copied from the supplied floating-sidebar portfolio skill, React Server Components by default, Lenis for smooth scrolling, and no Tailwind or database.

The design is deliberately quiet and editorial:

- A 260px floating, grain-textured sidebar at desktop widths and a 640px centered content column.
- Figtree throughout, with Newsreader italic used only for the single emphasized phrase in the home headline.
- Original monochrome `light-dark()` token system, hairline list rows, layered sidebar shadows, zero-padded counts, pill controls, and the supplied 140ms tactile interactions.
- A home-only phone top bar and accessible slide-out mobile sidebar below the source skill's 900px breakpoint. Subpages use their supplied back navigation.
- The supplied pixel-name reveal, click burst, photo stack, copy-email feedback, theme restoration, and reduced-motion handling. The optional Poke/Redis feature is excluded.

No colorful gradients, generic project-card layouts, glassmorphism, 3D treatments, blog, services, webinars, shop, courses, catalog, enrollment, or payment flows are in scope.

## Verified Identity and Content Rules

Use these supplied facts:

- Legal name: Lord Kevin Francis G. Jumawak
- Display name: Kevin Jumawak
- Role: Full-Stack Developer / Software Engineer
- Location: General Santos City, Philippines
- Contact: alphadaryl0425@gmail.com
- GitHub: `OXWiz666` at `https://github.com/OXWiz666`
- Education: BS Information Technology, STI College General Santos, graduated 2026
- Experience: Full-Stack Developer (May 2026–Present); MIS Intern, STI College General Santos (January–May 2026)
- Projects: ForgeKeep; ForgeKeep Wallet (In Development); Rural Health Unit Management System; SportsCity; DraftIQ (In Development)

The public GitHub profile may supply only directly verifiable information, including its public profile avatar, listed technologies, repository names, and public URLs. No achievements, employer/client relationships, project metrics, screenshots, feature claims, professional-network links, live URLs, or technical architecture details may be invented. Unknown project content remains visibly marked as not publicly available rather than being fabricated.

## Information Architecture

### Shared shell

`app/layout.tsx` renders the source skill's font setup, theme pre-paint script, Lenis root, click burst, floating sidebar, and main content shell. Sidebar navigation has only Home, About, Experience, Projects, Stack, and Contact. It has a copy-email CTA, theme toggle, GitHub link, location, and exact zero-padded counts. The source sample's blog, links, gear, resources, services, Poke, and other excluded navigation are removed.

### Home (`/`)

The homepage includes the public GitHub avatar with a reliable fallback, animated display name, role and location, the headline “I build software that solves real problems.” with only “real problems” in Newsreader italic, a short fact-grounded introduction, available contact action, brief professional/education highlights, selected-project rows, condensed stack rows, and GitHub activity.

Selected projects use the supplied `ProjectList` row presentation: thumbnail or purposeful neutral placeholder, title, short verified-or-conservative summary, category, in-development pill where applicable, two initially visible rows, a faded next row, and a reveal control.

### About (`/about`)

The about page uses the supplied page shell and photo-stack layout. It presents supplied professional identity, education, and a contact CTA. It only shows local portrait assets when they exist; otherwise it presents neutral photo-stack placeholders rather than fake images.

### Experience (`/experience`)

Experience is a dedicated hairline-row page with date ranges, roles, organization when supplied, technology tags, and expandable details. The MIS internship is attributed to STI College General Santos. The Full-Stack Developer entry has no employer attributed unless verified. Details never imply unprovided responsibilities or outcomes.

### Projects (`/projects`, `/projects/[slug]`)

The projects index lists all five projects as source-style rows. Detail pages consistently expose these sections: Overview, Problem, Solution, Technical architecture, Features, Technology stack, Screenshots, Engineering challenges, and Lessons learned. Sections whose details are not verified render an intentional unavailable/coming-soon state rather than fictional copy.

Each project data item supports a thumbnail, category, technologies, GitHub URL, verified live URL, screenshot gallery, status, and the detail-route content. “ForgeKeep Wallet” and “DraftIQ” display In Development. Gallery controls use the supplied native scroll-snap carousel whenever screenshots are available.

### Stack (`/stack`)

The stack page renders compact, scroll-aware rows grouped as Languages, Frontend, Backend, Databases, Infrastructure & DevOps, and AI & Automation. Candidate technologies must derive from supplied/verified profile information. The home page shows the compact key/value summary.

### Contact (`/contact`)

The contact page supplies an email CTA using `alphadaryl0425@gmail.com`, copy-to-clipboard behavior, confirmation toast, `mailto:` fallback, and GitHub link. It has no form that implies a delivery service or persistent storage.

## GitHub Integration

Server-only GitHub access is split into a small `lib/github.ts` module and presentation components.

- A GraphQL query requests `user.contributionsCollection` for the trailing 365 days, including total contributions and daily contribution cells. It uses `GITHUB_TOKEN` only on the server.
- A GitHub REST request obtains selected public repositories for `OXWiz666`. Repositories are whitelisted from the verified response/portfolio data rather than surfaced indiscriminately.
- Both requests use Next's `fetch` cache with `next: { revalidate: 43_200 }` (12 hours).
- Runtime response checks validate the expected shape before data reaches components.
- Missing token, unauthenticated results, rate limiting, network failure, unavailable user, and empty results show semantic, non-breaking empty/error content. The layout still renders a grayscale calendar structure with an accessible explanatory label.
- Daily graph cells are grayscale only and are keyboard-hover/focus discoverable with a real text description; no hardcoded contribution data is permitted.

`GITHUB_TOKEN` is documented in `.env.example` but never committed. A GitHub token is required to obtain contribution data through the GitHub GraphQL API; absence is an expected degraded mode, not a build error.

## Data and Assets

`lib/data.ts` is the sole local content definition. It exports strict types for identity, work entries, stack groups, links, project status, project details, and screenshots. It contains no sample strings from the source skill.

The public GitHub avatar is the initial profile-image source with a local `public/avatar.jpg` override. Project and photo assets are optional local paths. Missing images use the source skill's neutral placeholders. Screenshot arrays begin empty until verified files are provided, while the gallery components stay fully supported.

## Accessibility, Metadata, and Quality

- Semantic headings, labelled controls, visible keyboard focus, 44px mobile touch targets, non-empty `alt` text for meaningful images, and accessible dynamic copy-email status.
- Metadata per route; project metadata derives from validated static project data.
- No hydration-sensitive current dates in the initial client render; theme restoration uses the source pre-paint script and `suppressHydrationWarning` exactly as designed.
- Decorative motion turns off under `prefers-reduced-motion`.
- Build validation includes focused automated tests for GitHub parsing/fallbacks and data invariants, TypeScript, lint, and production build. Visual checks cover 1200px and 390px in light/dark and reduced-motion states.

## Implementation Boundaries

The project is scaffolded in the currently empty workspace with the App Router, strict TypeScript, no `src/`, `@/*` aliases, plain CSS, and Lenis. The source skill's shared files are copied before targeted adaptations. The external Mar Wie Ang site informs only high-level visual structure; no personal information, achievements, or proprietary content is copied.

## Open Inputs Deferred Safely

No project screenshots, live URLs, project repositories, Full-Stack Developer employer, or professional links were supplied. Their slots remain fully functional but absent or visibly unavailable until verified information is available.
