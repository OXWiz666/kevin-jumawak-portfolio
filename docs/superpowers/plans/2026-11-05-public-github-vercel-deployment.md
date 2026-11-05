# Public GitHub and Vercel Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the current portfolio safely in a new public GitHub repository and deploy it from `main` to Vercel at `kevinjumawak.vercel.app`.

**Architecture:** Build and validate the existing Next.js application before publishing. Since the local history contains tracked generated output and an environment file, create a new clean root history for the public repository that contains only publishable source files; retain local working files and do not expose the prior history.

**Tech Stack:** Git, GitHub, Next.js 16, npm, Vercel.

**Spec:** `docs/superpowers/specs/2026-11-05-public-github-vercel-deployment-design.md`

## Global Constraints

- Create `kevin-jumawak-portfolio` as a public repository with `main` as the default and production branch.
- Do not publish `.env`, `node_modules`, `.next`, TypeScript build output, or existing local Git history that contains them.
- Preserve all local files; remove generated directories from Git tracking only.
- Use `kevinjumawak.vercel.app` as the requested Vercel domain, subject to availability in the authenticated Vercel account.
- Do not alter an unrelated GitHub repository or Vercel project.

## Review Focus

- Tracked secret file: the fresh public history must contain no `.env` path or content.
- Tracked generated output: the public commit must contain no `node_modules/` or `.next/` paths.
- Build correctness: lint, tests, TypeScript checking, and production build must succeed from the retained source.
- Repository identity: `origin` must point to the newly created public repository before pushing.
- Deployment identity: Vercel project and domain must be verified before assigning production traffic.

---

### Task 1: Validate and prepare a publishable source set

**Files:**
- Modify: `.gitignore`
- Modify: Git index only (remove generated and secret paths from tracking)

**Interfaces:**
- Consumes: current working tree, package scripts, and ignore rules.
- Produces: a clean, buildable source set without credentials or generated output.

- [ ] **Step 1: Confirm the tracked path inventory contains the known unsafe paths**

Run: `git ls-files .env node_modules .next`
Expected: confirms why a clean public history is necessary without printing the environment-file contents.

- [ ] **Step 2: Verify `.gitignore` excludes `.env`, `node_modules/`, `.next/`, and `*.tsbuildinfo`**

Expected: all four entries are present before the new root commit is prepared.

- [ ] **Step 3: Remove unsafe paths from the Git index while keeping all local copies intact**

Run: `git rm -r --cached -- .env node_modules .next`
Expected: staged removals only; the files remain on disk.

- [ ] **Step 4: Validate the portfolio from its retained local source**

Run: `npm test; npm run lint; npx tsc --noEmit; npm run build`
Expected: all commands exit successfully.

### Task 2: Create a clean public GitHub history and repository

**Files:**
- Modify: Git branch metadata and remote configuration only

**Interfaces:**
- Consumes: Task 1's validated source set and the GitHub account connection.
- Produces: public `kevin-jumawak-portfolio` repository with a clean `main` branch.

- [ ] **Step 1: Create an orphan `main` commit with only publishable files**

Expected: the new root commit includes application source, package manifests, tests, documentation, and `.gitignore`, but no prior commit history, secret files, or generated directories.

- [ ] **Step 2: Create the public GitHub repository `kevin-jumawak-portfolio`**

Expected: GitHub reports a new repository with public visibility and `main` as its default branch.

- [ ] **Step 3: Configure `origin` to the new repository and push `main`**

Expected: the local clean root commit is the remote `main` tip.

- [ ] **Step 4: Verify the remote tree and repository visibility**

Expected: GitHub lists no `.env`, `node_modules`, or `.next` paths and the repository is public.

### Task 3: Deploy and verify Vercel production

**Files:**
- Create: `.vercel/project.json` (Vercel project linkage; ignored from Git)

**Interfaces:**
- Consumes: public GitHub `main` repository and Vercel account connection.
- Produces: a ready production deployment at `kevinjumawak.vercel.app`.

- [ ] **Step 1: Create or select the Vercel project named `kevin-jumawak-portfolio` and verify its owner**

Expected: project identity is confirmed before deploying.

- [ ] **Step 2: Connect the Vercel project to the GitHub repository with `main` as the production branch**

Expected: future pushes to `main` trigger production deployments.

- [ ] **Step 3: Deploy the validated source to production**

Expected: Vercel reports a ready production deployment.

- [ ] **Step 4: Assign and verify `kevinjumawak.vercel.app`**

Expected: the domain belongs to the authenticated account, maps to the project, and responds successfully.

- [ ] **Step 5: Fetch the production homepage through Vercel and confirm a successful response**

Expected: the deployed homepage serves the portfolio without disabling deployment protection.
