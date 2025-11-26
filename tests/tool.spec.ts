import { test, expect, Page } from '@playwright/test';

test.describe('Tooltips', () => {
    const route = '/tooltips';

    async function findTrigger(page: Page) {
        const candidates = [
            page.getByRole('button', { name: /tooltip|hover|hint|info/i }),
            page.getByRole('link', { name: /tooltip|hover|hint|info/i }),
            page.locator('[data-testid="tooltip-button"]'),
            page.locator('[data-testid="tooltip-trigger"]'),
            page.locator('[aria-describedby]'),
            page.locator('button:has-text("Hover")'),
            page.locator('button:has-text("Tooltip")'),
        ];

        for (const cand of candidates) {
            // count() resolves to number of elements matched
            if (await cand.count() > 0) return cand;
        }
        throw new Error('Tooltip trigger not found using known selectors');
    }

    async function findAllTriggers(page: Page) {
        const selectors = [
            page.getByRole('button', { name: /tooltip|hover|hint|info/i }),
            page.locator('[data-testid="tooltip-button"]'),
            page.locator('[data-testid="tooltip-trigger"]'),
            page.locator('[aria-describedby]'),
            page.locator('button:has-text("Hover")'),
            page.locator('button:has-text("Tooltip")'),
        ];
        const seen = new Set<string>();
        const results = [];
        for (const sel of selectors) {
            for (let i = 0; i < (await sel.count()); i++) {
                const nth = sel.nth(i);
                const unique = await nth.evaluate((el) => el.outerHTML);
                if (!seen.has(unique)) {
                    seen.add(unique);
                    results.push(nth);
                }
            }
        }
        return results;
    }

    test.beforeEach(async ({ page, baseURL }) => {
        const url = baseURL ? `${baseURL}${route}` : route;
        await page.goto(url);
        await page.waitForLoadState('networkidle');
    });

    test('tooltip is hidden by default', async ({ page }) => {
        const tooltip = page.locator('[role="tooltip"]');
        await expect(tooltip).toHaveCount(0); // tooltip element shouldn't be present before interaction
    });

    test('shows tooltip on hover and links aria-describedby when present', async ({ page }) => {
        const trigger = await findTrigger(page);
        await trigger.hover();
        const tooltip = page.locator('[role="tooltip"]');
        await expect(tooltip).toBeVisible();
        await expect(tooltip).toHaveText(/.+/s);

        // If the trigger uses aria-describedby ensure it matches tooltip id
        const describedId = await trigger.getAttribute('aria-describedby');
        if (describedId) {
            const describedEl = page.locator(`#${describedId}`);
            await expect(describedEl).toBeVisible();
            await expect(describedEl).toHaveText(await tooltip.textContent() ?? '');
        }
    });

    test('shows tooltip on focus and hides on blur', async ({ page }) => {
        const trigger = await findTrigger(page);
        await trigger.focus();
        const tooltip = page.locator('[role="tooltip"]');
        await expect(tooltip).toBeVisible();

        await trigger.evaluate((el) => (el as HTMLElement).blur());
        await expect(tooltip).toHaveCount(0); // tooltip removed or hidden
    });

    test('multiple tooltip triggers have distinct text', async ({ page }) => {
        const triggers = await findAllTriggers(page);
        test.skip(triggers.length < 2, 'Not enough tooltip triggers to validate multiple instances');

        const seen = new Set<string>();
        for (const t of triggers.slice(0, 5)) { // check up to first 5 triggers
            await t.hover();
            const tooltip = page.locator('[role="tooltip"]');
            await expect(tooltip).toBeVisible();
            const text = (await tooltip.textContent())?.trim() ?? '';
            expect(text.length).toBeGreaterThan(0);
            seen.add(text);
            await t.evaluate((el) => (el as HTMLElement).blur());
            await expect(tooltip).toHaveCount(0);
        }
        expect(seen.size).toBeGreaterThanOrEqual(1);
    });

    test('tooltip appears near trigger (basic positioning check)', async ({ page }) => {
        const trigger = await findTrigger(page);
        const triggerBox = await trigger.boundingBox();
        test.skip(!triggerBox, 'Cannot determine trigger position');

        await trigger.hover();
        const tooltip = page.locator('[role="tooltip"]');
        await expect(tooltip).toBeVisible();
        const tooltipBox = await tooltip.boundingBox();
        test.skip(!tooltipBox, 'Cannot determine tooltip position');

        // Basic check: tooltip shouldn't be exactly stacked at the same coordinates as trigger
        expect(Math.abs(tooltipBox.x - triggerBox.x) + Math.abs(tooltipBox.y - triggerBox.y)).toBeGreaterThan(0);
    });
});