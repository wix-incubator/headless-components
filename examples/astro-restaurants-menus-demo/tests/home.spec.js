import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("has title and React link", async ({ page }) => {
    await page.goto("/");

    const logo = page.locator(".App-logo");
    await expect(logo).toBeVisible();

    const reactLink = page.getByText("Learn React");
    await expect(reactLink).toBeVisible();
    await expect(reactLink).toHaveAttribute("href", "https://reactjs.org");

    const instructionText = page.getByText(
      "Edit src/components/App.jsx and save to reload."
    );
    await expect(instructionText).toBeVisible();
  });
});
