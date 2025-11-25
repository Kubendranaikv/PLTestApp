import {test, expect} from '@playwright/test';

/* test('basic test', async ({page}) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Example Domine/);
}); 
test('navigate to Google', async ({ page }) => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
}); 

test('navigate to Google', async ({ page }) => {
    await page.goto('https://www.google.com');
    await expect(page).toHaveTitle(/Google/);
}); */

test('search playwright.dev in Google', async ({ page }) => {
    await page.goto('https://www.google.com');

    // handle possible consent dialog
    const consentSelectors = [
        'button:has-text("I agree")',
        'button:has-text("I Accept")',
        'button:has-text("Accept all")',
        'text=I agree'
    ];
    for (const sel of consentSelectors) {
        const btn = page.locator(sel);
        if (await btn.count() > 0) {
            await btn.click();
            break;
        }
    }

    const searchBox = page.locator('input[name="q"]');
    await searchBox.fill('playwright.dev');
    await Promise.all([
        page.waitForNavigation(),
        searchBox.press('Enter'),
    ]);

    // verify first result points to playwright.dev and mentions Playwright
    const firstResult = page.locator('#search a').first();
    await expect(firstResult.locator('h3')).toContainText(/playwright/i);
    await expect(firstResult).toHaveAttribute('href', /playwright\.dev/);
});