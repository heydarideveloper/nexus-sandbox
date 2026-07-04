import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('/os accessible fallback', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/os');
  });

  test('renders every content section with real data', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Mohammad Heydari' })).toBeVisible();
    for (const heading of [
      'Identity',
      'The Brain — Knowledge Graph',
      'Career Line',
      'Innovation Lab',
      'Learning Observatory',
      'Automation Center',
      'Research Lab',
      'Engineering Notes',
      'Achievements',
    ]) {
      await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeVisible();
    }
    await expect(page.getByText('540,000+', { exact: true })).toBeVisible();
    await expect(page.getByText(/Pezeshket/).first()).toBeVisible();
    await expect(page.getByText(/binary WebSocket/i).first()).toBeVisible();
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    const results = await new AxeBuilder({ page }).analyze();
    const severe = results.violations.filter(
      (v) => v.impact === 'serious' || v.impact === 'critical',
    );
    expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
  });

  test('resume studio switches presets and keeps facts verbatim', async ({ page }) => {
    const region = page.locator('#resume');
    await region.scrollIntoViewIfNeeded();
    await expect(region.getByRole('radio', { name: 'Startup' })).toBeVisible();

    await region.getByRole('radio', { name: 'Frontend' }).click();
    await expect(
      region.getByText('Senior Frontend Developer | React & React Native'),
    ).toBeVisible();

    await region.getByRole('radio', { name: 'AI Company' }).click();
    await expect(region.getByText(/LLM Integration & Production Systems/)).toBeVisible();
    await expect(region.getByText(/13\+ languages at VoKaN/).first()).toBeVisible();
  });

  test('links to the 3D world', async ({ page }) => {
    await page.getByRole('link', { name: /enter the 3d world/i }).click();
    await expect(page).toHaveURL('/');
  });
});

test('mode select screen passes axe scan', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /skip/i }).click();
  await expect(page.getByRole('button', { name: /recruiter mode/i })).toBeVisible();
  // Wait for entrance animations to settle: axe measures blended colors, so a scan
  // mid-fade reports false contrast failures.
  await page.waitForFunction(() => {
    const el = document.querySelector('a[href="/os"]')?.parentElement;
    return el != null && getComputedStyle(el).opacity === '1';
  });
  const results = await new AxeBuilder({ page }).analyze();
  const severe = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(severe, JSON.stringify(severe, null, 2)).toEqual([]);
});
