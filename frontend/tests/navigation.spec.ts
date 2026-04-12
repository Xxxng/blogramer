import { test, expect } from '@playwright/test';

test.describe('Blogramer UI Navigation', () => {
  const baseURL = 'http://localhost:34115'; // Wails default dev server URL

  test.beforeEach(async ({ page }) => {
    await page.goto(baseURL);
  });

  test('should load dashboard by default', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Blogramer');
    await expect(page.locator('h2')).toContainText('대시보드');
  });

  test('should navigate to Accounts page', async ({ page }) => {
    await page.click('text=계정 연동');
    await expect(page.locator('h2')).toContainText('계정 연동');
    await expect(page.locator('h3')).toContainText('블로그 계정 목록');
  });

  test('should navigate to Posts page', async ({ page }) => {
    await page.click('text=발행 관리');
    await expect(page.locator('h2')).toContainText('발행 관리');
    await expect(page.locator('h3')).toContainText('포스팅 관리');
  });

  test('should navigate to Settings page', async ({ page }) => {
    await page.click('text=설정');
    await expect(page.locator('h2')).toContainText('설정');
  });
});
