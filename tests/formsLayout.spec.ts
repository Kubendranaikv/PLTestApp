import { test, expect } from '@playwright/test';
import { threadId } from 'worker_threads';
 
 
 test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4200');
  await page.getByTitle('Forms').click();
  await page.waitForTimeout(3000);
  await page.getByTitle('Form Layouts').click();
  await page.waitForTimeout(3000);
});
 
test('Forms Layout Page Automation : Inline form and  Using the Grid', async ({ page }) => {
//   await page.goto('http://localhost:4200');
 
  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/playwright-test-admin Demo Application/);
  // await page.locator("xpath=//div[@class='icon status-primary']").click();
 
//   await page.locator(".input-full-width[placeholder='Email'][type='text']").fill('test1@exaple.com');
 
  await page.getByPlaceholder("Email").first().fill("test1@exaple.com");
  //await page.getByPlaceholder("xpath=//iput[@type='password' and @placeholder='password']").fill("password123");
//   await page.waitForTimeout(2000);
  await page.getByPlaceholder("Jane Doe").fill("John Wick");
//   await page.getByText("")
 await page.getByText('Remember me').first().check();
 await page.getByText('Submit').first().click();
 await page.locator("//input[@type='email']").first().fill("test2@example");
 await page.locator("//input[@type='password']").first().fill("123456");
 
 await page.locator("xpath=//span[@class='inner-circle']/following-sibling::span[text()='Option 1']").check();
 await page.getByRole('button',{name:'Sign'}).first().click();
 
  await page.locator("//input[@type='email']").nth(1).fill("test3@example");
 await page.locator("//input[@type='password']").nth(1).fill("678910");
await page.locator('xpath=//span[text()="Check me out"]/preceding-sibling::span[@class="custom-checkbox"]').check();
await page.getByText('Submit').nth(1).click();
  /*
   
  await page.locator('rect[transform="rotate(180 12 12)"]').click();
  //span[@class='custom-checkbox']/following-sibling::span[contains(text(),'Check me out')]
 */  
const headerText = await page.locator(':text-is("Using the Grid")').textContent();
  console.log(headerText); // "Using the Grid"
  await page.locator(":text-is('Using the Grid')").hover();
  expect(page.locator(":text-is('Using the Grid')")).toBeVisible();
});