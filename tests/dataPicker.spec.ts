import { test, expect } from '@playwright/test';
import { clear } from 'console';
import { threadId } from 'worker_threads'; 
 
 
 test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.getByTitle('Forms').click();
  await page.waitForTimeout(3000);
  await page.getByTitle('Form Layouts').click();
  await page.waitForTimeout(3000);
});

/* test('Basic form Page Automation : Basic form', async ({page}) => {
 await expect(page).toHaveTitle(/playwright-test-admin Demo Application/);
    await page.getByPlaceholder('Form picker').click();
    await page.locator('xpath=//nb-calendar-day-cell[@class="day-cell ng-star-inserted"][contains(@aria-label,"2024-06-05")]').click();
    await page.getByPlaceholder('Range picker').click();
    await page.locator('xpath=//nb-calendar-day-cell[@class="day-cell ng-star-inserted"][contains(@aria-label,"2024-06-05")]').click();
    await page.locator('xpath=//nb-calendar-day-cell[@class="day-cell ng-star-inserted"][contains(@aria-label,"2024-06-15")]').click();
    
   test('locating child elements',async({page})=>{
   await page.locator('nb-card').locator('nb-card-body').locator('form').locator('div').locator("input[placeholder='Recipients']").fill("testUser");
   await page.locator('nb-card').locator('nb-card-body').locator('form').locator('div').locator("input[placeholder='Subject']").fill("testUser2");
   await page.locator('nb-card').locator('nb-card-body').locator('form').locator('div').locator("textarea[placeholder='Message']").fill("testUser3");
   await page.locator('nb-card').locator('nb-card-body').locator('form').getByText('Send').first().click();
 
});
*/
test('locating child elements using nth() and chained locators', async ({ page }) => {
    const secondCardForm = page.locator('nb-card').nth(1).locator('form');
    await secondCardForm.locator("input[placeholder='Recipients']").fill('alice@example.com');
    await secondCardForm.locator("input[placeholder='Subject']").fill('Test Subject');
    await secondCardForm.locator("textarea[placeholder='Message']").fill('Test message body');
    await expect(secondCardForm.locator("input[placeholder='Recipients']")).toHaveValue('alice@example.com');
    await expect(secondCardForm.locator("input[placeholder='Subject']")).toHaveValue('Test Subject');
    await expect(secondCardForm.locator("textarea[placeholder='Message']")).toHaveValue('Test message body');
    await secondCardForm.getByText('Send').first().click();
});

test('locating child elements using has() to scope the parent card', async ({ page }) => {
    const scopedCard = page.locator('nb-card', { has: page.getByPlaceholder('Recipients') });
    const form = scopedCard.locator('form');
    await form.locator("input[placeholder='Recipients']").fill('bob@example.com');
    await form.locator("input[placeholder='Subject']").fill('Scoped Subject');
    await form.locator("textarea[placeholder='Message']").fill('Scoped message body');
    await expect(form.locator("input[placeholder='Recipients']")).toHaveValue('bob@example.com');
    await expect(form.locator("input[placeholder='Subject']")).toHaveValue('Scoped Subject');
    await expect(form.locator("textarea[placeholder='Message']")).toHaveValue('Scoped message body');
    await form.getByRole('button', { name: 'Send' }).click();
});