import { expect, test } from '@playwright/test';

test('brain district opens skill graph with empty-state guidance', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await page
    .getByRole('navigation', { name: /quick travel/i })
    .getByRole('button', { name: 'The Brain' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/actual map of what he knows/i)).toBeVisible();
  await expect(page.getByText(/drag to rotate/i)).toBeVisible();
});
