const { test, expect } = require('@playwright/test');

test.describe('End-to-End User Flow', () => {
    test('should complete the full Login -> Add Item -> Checkout flow', async ({ page }) => {
        const uniqueId = Date.now();
        const email = `user${uniqueId}@example.com`;
        const password = 'password123';

        // 1. Signup and Login
        await page.goto('/signup');
        await page.getByLabel(/Email Address/i).fill(email);
        await page.getByLabel(/Password/i).fill(password);
        await page.getByRole('button', { name: /Create Free Account/i }).click();

        await expect(page).toHaveURL('/', { timeout: 10000 });
        await expect(page.getByText('ShopSmart CRUD App')).toBeVisible();

        // 2. Add Item
        const itemName = `Test Item ${uniqueId}`;
        await page.fill('#item-name', itemName);
        await page.fill('#item-desc', 'Premium testing item');
        await page.click('button:has-text("Add Item")');

        // Verify item appears in list
        await expect(page.getByText(itemName)).toBeVisible();

        // 3. Checkout
        await page.click('#checkout-btn');
        
        // Verify processing and success
        await expect(page.locator('#checkout-message')).toContainText('Processing...');
        await expect(page.locator('#checkout-message')).toContainText('Success!', { timeout: 5000 });

        // Verify items list is cleared (as per simulation logic)
        await expect(page.getByText('No items found')).toBeVisible();

        // 4. Logout
        await page.click('button:has-text("Logout")');
        await expect(page).toHaveURL('/login');
    });
});
