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

test('tool tips', async ({ page }) =>
{
  await page.getByTitle('Modal & Overlays').click()
await page.getByTitle('Tooltip').click()
 
 
const toolTipCard = page.locator('nb-card', {hasText:"Tooltip Placements"})
await toolTipCard.getByRole('button',{name:"Top"}).hover()
page.getByRole('tooltip')
const toolTip = await page.locator('nbtooltip').textContent()
await page.getByRole('tooltip').waitFor({state:'visible'})
expect(toolTip).toEqual('This is a tooltip')
const tooltipplace = await expect(toolTipCard.getByRole('button',{name:"Top"})).toHaveAttribute('ng-reflect-position','top')
 
})