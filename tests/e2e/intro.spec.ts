import { expect, test } from "@playwright/test";

test("covers the home hero before the welcome intro becomes interactive", async ({ page }) => {
  await page.goto("/");

  const skip = page.getByRole("button", { name: "Skip" });
  await expect(page.getByRole("dialog", { name: /portfolio/i })).toBeVisible();
  await expect(page.locator(".home-hero")).not.toBeVisible();
  await page.waitForFunction(() => document.querySelector(".shell")?.hasAttribute("inert"));
  await expect(skip).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(skip).toBeFocused();

  await skip.click();
  await expect(page.getByRole("dialog", { name: /portfolio/i })).toBeHidden();
  await expect(page.locator(".home-hero")).toBeVisible();
});

test("bypasses the welcome screen for returning visitors and reduced-motion visitors", async ({ browser }) => {
  const returning = await browser.newPage();
  await returning.addInitScript(() => sessionStorage.setItem("pet-intro-seen", "1"));
  await returning.goto("/");
  await expect(returning.getByRole("dialog", { name: /portfolio/i })).toBeHidden();
  await expect(returning.locator(".home-hero")).toBeVisible();

  const reducedMotion = await browser.newPage();
  await reducedMotion.emulateMedia({ reducedMotion: "reduce" });
  await reducedMotion.goto("/");
  await expect(reducedMotion.getByRole("dialog", { name: /portfolio/i })).toBeHidden();
  await expect(reducedMotion.locator(".home-hero")).toBeVisible();
});

test("dismisses with Escape and keeps minimal outline actions readable in both themes", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Skip" })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: /portfolio/i })).toBeHidden();
  await expect(page.locator(".home-portrait--minimal")).toBeVisible();
  await expect(page.locator(".home-portrait-card")).toHaveCount(0);

  for (const theme of ["light", "dark"]) {
    await page.evaluate((nextTheme) => {
      document.documentElement.dataset.theme = nextTheme;
    }, theme);

    const outlines = page.locator(".outline-action");
    expect(await outlines.count()).toBeGreaterThanOrEqual(5);
    await expect(outlines.first()).toHaveCSS("border-top-width", "1px");
    await expect(outlines.first()).toHaveCSS("color", theme === "dark" ? "rgb(236, 236, 238)" : "rgb(17, 17, 19)");
  }
});
