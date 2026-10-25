import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const base = process.env.STUDIO_DALO_BASE_URL || 'http://127.0.0.1:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const observations = { browser: browser.version(), pageErrors: [], consoleErrors: [], failedResponses: [], viewports: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  page.on('pageerror', error => observations.pageErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') observations.consoleErrors.push(message.text()); });
  page.on('response', response => { if (response.url().startsWith(base) && response.status() >= 400) observations.failedResponses.push({ path: new URL(response.url()).pathname, status: response.status() }); });
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
    await page.setViewportSize({ width, height });
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `artifacts/${name}-hero.png` });
    observations.viewports.push({ width, height, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) });
    await page.evaluate(() => window.scrollTo({ top: document.getElementById('work').offsetTop - 30, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `artifacts/${name}-work.png` });
    await page.locator('.project-card').first().click();
    await page.getByRole('dialog').waitFor();
    await page.screenshot({ path: `artifacts/${name}-project.png` });
    await page.getByRole('button', { name: /^Enlarge drawing/ }).click();
    await page.locator('.zoom-dialog').waitFor();
    await page.screenshot({ path: `artifacts/${name}-drawing.png` });
    await page.getByRole('button', { name: 'Close enlarged media', exact: true }).click();
    await page.getByRole('link', { name: 'Discuss a similar project' }).click();
    await page.locator('#contact-title').waitFor();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `artifacts/${name}-contact.png` });
    await page.goto(base, { waitUntil: 'networkidle' });
    for (const image of await page.locator('img').all()) {
      await image.scrollIntoViewIfNeeded();
      await image.evaluate(element => element.decode().catch(() => {}));
    }
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `artifacts/${name}-home.png`, fullPage: true });
  }
  await fs.writeFile('artifacts/browser-observations.json', JSON.stringify(observations, null, 2) + '\n');
  console.log(JSON.stringify(observations, null, 2));
  if (observations.pageErrors.length || observations.consoleErrors.length || observations.failedResponses.length || observations.viewports.some(v => v.overflow)) process.exitCode = 1;
} finally {
  await browser.close();
}
