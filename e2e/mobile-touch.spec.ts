import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
});

test('virtual joystick visible on phone viewport', async ({ page }) => {
  await expect(page.getByTestId('virtual-joystick')).toBeVisible();
});

test('explorer hint mentions tap and joystick on mobile', async ({ page }) => {
  await expect(page.getByText(/tap ground to fly/i)).toBeVisible();
  await expect(page.getByText(/joystick/i)).toBeVisible();
});

test('chat opens as bottom sheet on mobile', async ({ page }) => {
  await page.getByRole('button', { name: /^chat$/i }).click();
  const dialog = page.getByRole('dialog', { name: /talk with mohammad/i });
  await expect(dialog).toBeVisible();
  const box = await dialog.boundingBox();
  expect(box).not.toBeNull();
  if (box) {
    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();
    if (viewport) expect(box.width).toBeGreaterThan(viewport.width * 0.9);
  }
});

test('portal opens via quick travel tap on mobile', async ({ page }) => {
  await page
    .getByRole('navigation', { name: /quick travel/i })
    .getByRole('button', { name: 'Innovation Lab' })
    .click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText(/real system he built/i).first()).toBeVisible();
});

test('/os link visible on phones', async ({ page }) => {
  await expect(page.getByRole('link', { name: /\/os/i })).toBeVisible();
});
