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
        const itemName = 'E2E Item';
        const itemDesc = 'E2E Description';

        await page.fill('label:has-text("Name:") + input', itemName); // Use sibling selector or id if available
        // Wait, I fail to use ID in my mind. I added IDs in previous step!
        // Let's use IDs.
        await page.fill('#item-name', itemName);
        await page.fill('#item-desc', itemDesc);
        await page.click('button:has-text("Add Item")');

        await expect(page.getByText(itemName)).toBeVisible();
        await expect(page.getByText(itemDesc)).toBeVisible();
    });

    test('should delete an item', async ({ page }) => {
        // Add item first
        const itemName = 'Item to Delete';
        await page.fill('#item-name', itemName);
        await page.click('button:has-text("Add Item")');
        await expect(page.getByText(itemName)).toBeVisible();

        // Delete it
        await page.click(`li:has-text("${itemName}") button:has-text("Delete")`);
        await expect(page.getByText(itemName)).not.toBeVisible();
    });
});
