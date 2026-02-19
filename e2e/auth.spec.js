const { test, expect } = require('@playwright/test');

test.describe('Auth Flow', () => {
    // Reset state or use a unique user for each test?
    // Since we use in-memory backend without exposed reset endpoint, shared state might be an issue if we don't restart server.
    // But webServer reuses existing server (if running).
    // Ideally we should have a way to reset backend state.
    // For now, we'll use unique credentials.

    test('should allow a user to signup and login', async ({ page }) => {
        const uniqueId = Date.now();
        const email = `test${uniqueId}@example.com`;
        const password = 'password123';

        await page.goto('/signup');

        // Signup
        await page.fill('input[type="email"]', email);
        await page.fill('input[type="password"]', password);
        await page.click('button[type="submit"]');

        // Should redirect to Home (Items Page)
        await expect(page).toHaveURL('/');
        await expect(page.getByText('ShopSmart CRUD App')).toBeVisible();

        // Check logout
        await page.click('button:has-text("Logout")');
        await expect(page).toHaveURL('/login');
    });

    test('should redirect unauthenticated user to login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL('/login');
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    });
});
