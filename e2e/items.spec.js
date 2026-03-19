const { test, expect } = require('@playwright/test');

test.describe('Items Management', () => {
    let email;
    let password;

    test.beforeEach(async ({ page }) => {
        // Register a new user for each test suite run
        // Actually, we can do it once per worker or unique per test.
        // Unique per test is safer.
        const uniqueId = Date.now() + Math.random();
        email = `user${uniqueId}@example.com`;
        password = 'password123';

        await page.goto('/signup');
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/');
    });

    test('should add a new item', async ({ page }) => {
        const uniqueSuffix = Date.now().toString().slice(-4);
        const itemName = `E2E Item ${uniqueSuffix}`;
        const itemDesc = `E2E Description ${uniqueSuffix}`;

        await page.fill('#item-name', itemName);
        await page.fill('#item-desc', itemDesc);
        await page.click('button:has-text("Add Item")');

        // Scoped expectation to avoid strict mode violations if other items exist
        const itemRow = page.locator('li').filter({ hasText: itemName });
        await expect(itemRow).toBeVisible();
        await expect(itemRow.getByText(itemDesc)).toBeVisible();
    });

    test('should delete an item', async ({ page }) => {
        const uniqueSuffix = Date.now().toString().slice(-4);
        const itemName = `Item to Delete ${uniqueSuffix}`;
        
        // Add item first
        await page.fill('#item-name', itemName);
        await page.click('button:has-text("Add Item")');
        
        const itemRow = page.locator('li').filter({ hasText: itemName });
        await expect(itemRow).toBeVisible();

        // Delete it
        await itemRow.getByRole('button', { name: 'Delete' }).click();
        await expect(page.getByText(itemName)).not.toBeVisible();
    });
});
