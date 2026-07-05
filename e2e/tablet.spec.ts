import { expect, test } from '@playwright/test';

test('tablet viewport shows HUD and quick travel without layout break', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await expect(page.getByRole('navigation', { name: /district quick travel/i })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: /world power/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /\/os/i })).toBeVisible();
});
