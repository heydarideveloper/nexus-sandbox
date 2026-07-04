import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('boot sequence runs and can be skipped into mode select', async ({ page }) => {
  await expect(page.getByRole('status', { name: /booting/i })).toBeVisible();
  await page.getByRole('button', { name: /skip/i }).click();
  await expect(page.getByRole('button', { name: /recruiter mode/i })).toBeVisible();
  await expect(page.getByText('Mohammad Heydari')).toBeVisible();
});

test('explorer mode enters the world with HUD and quick travel', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await expect(page.getByRole('navigation', { name: /district quick travel/i })).toBeVisible();
  await expect(page.getByRole('progressbar', { name: /world power/i })).toBeVisible();
});

test('guided mode shows the tour banner and advances stops', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /recruiter mode/i }).click();
  await expect(page.getByText(/guided tour · stop 1\/8/i)).toBeVisible();
  await page.getByRole('button', { name: /^enter$/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /next stop/i }).click();
  await expect(page.getByText(/guided tour · stop 2\/8/i)).toBeVisible();
});

const districts = [
  ['Identity Plaza', 'identity verified'],
  ['Career Line', 'transit map'],
  ['Innovation Lab', 'real system he built'],
  ['System Design Factory', 'server-authoritative by construction'],
  ['Learning Observatory', 'training runs'],
  ['Automation Center', 'no imaginary bots'],
  ['Mission Control', 'mission status'],
] as const;

for (const [name, marker] of districts) {
  test(`district "${name}" opens with real content`, async ({ page }) => {
    await page.getByRole('button', { name: /skip/i }).click();
    await page.getByRole('button', { name: /free roam/i }).click();
    await page
      .getByRole('navigation', { name: /quick travel/i })
      .getByRole('button', { name })
      .click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText(new RegExp(marker, 'i')).first()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  });
}

test('visiting districts raises world power and unlocks achievements', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  const nav = page.getByRole('navigation', { name: /quick travel/i });
  await nav.getByRole('button', { name: 'Identity Plaza' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByText(/unlocked — 10 years/i)).toBeVisible();
  const power = page.getByRole('progressbar', { name: /world power/i });
  await expect(power).toHaveAttribute('aria-valuenow', String(Math.round((1 / 8) * 100)));
});

test('career station expands with problems, architecture, and lessons', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await page
    .getByRole('navigation', { name: /quick travel/i })
    .getByRole('button', { name: 'Career Line' })
    .click();
  await page
    .getByRole('button', { name: /Portal\.ir/ })
    .first()
    .click();
  await expect(
    page.getByText(/540,000\+ users and 10,000\+ active websites/i).first(),
  ).toBeVisible();
  await expect(page.getByText(/lessons learned/i).first()).toBeVisible();
});

test('innovation lab opens Jackpot with the live slots demo', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await page
    .getByRole('navigation', { name: /quick travel/i })
    .getByRole('button', { name: 'Innovation Lab' })
    .click();
  await page
    .getByRole('button', { name: /Jackpot/ })
    .first()
    .click();
  await expect(page.getByText(/server-authoritative spin/i)).toBeVisible();
  await page.getByRole('button', { name: /SPIN \(10 credits\)/ }).click();
  await expect(page.getByText(/ROUND_RESULT #1/)).toBeVisible({ timeout: 5000 });
});

test('chat twin answers from evidence without any API (local fallback)', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await page.getByRole('button', { name: /talk to my twin/i }).click();
  const dialog = page.getByRole('dialog', { name: /talk with mohammad/i });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('textbox', { name: /your question/i }).fill('Tell me about Portal');
  await dialog.getByRole('button', { name: /^ask$/i }).click();
  await expect(dialog.getByText(/Portal\.ir/).first()).toBeVisible({ timeout: 10_000 });
});

test('chat twin refuses questions with no evidence', async ({ page }) => {
  await page.getByRole('button', { name: /skip/i }).click();
  await page.getByRole('button', { name: /free roam/i }).click();
  await page.getByRole('button', { name: /talk to my twin/i }).click();
  const dialog = page.getByRole('dialog', { name: /talk with mohammad/i });
  await dialog
    .getByRole('textbox', { name: /your question/i })
    .fill('What Formula 1 team does he drive for?');
  await dialog.getByRole('button', { name: /^ask$/i }).click();
  await expect(dialog.getByText(/don't have documented evidence/i)).toBeVisible({
    timeout: 10_000,
  });
});
