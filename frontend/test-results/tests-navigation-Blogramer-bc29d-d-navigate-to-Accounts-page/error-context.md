# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\navigation.spec.ts >> Blogramer UI Navigation >> should navigate to Accounts page
- Location: tests\navigation.spec.ts:15:3

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:34115/
Call log:
  - navigating to "http://localhost:34115/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Blogramer UI Navigation', () => {
  4  |   const baseURL = 'http://localhost:34115'; // Wails default dev server URL
  5  | 
  6  |   test.beforeEach(async ({ page }) => {
> 7  |     await page.goto(baseURL);
     |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:34115/
  8  |   });
  9  | 
  10 |   test('should load dashboard by default', async ({ page }) => {
  11 |     await expect(page.locator('h1')).toContainText('Blogramer');
  12 |     await expect(page.locator('h2')).toContainText('대시보드');
  13 |   });
  14 | 
  15 |   test('should navigate to Accounts page', async ({ page }) => {
  16 |     await page.click('text=계정 연동');
  17 |     await expect(page.locator('h2')).toContainText('계정 연동');
  18 |     await expect(page.locator('h3')).toContainText('블로그 계정 목록');
  19 |   });
  20 | 
  21 |   test('should navigate to Posts page', async ({ page }) => {
  22 |     await page.click('text=발행 관리');
  23 |     await expect(page.locator('h2')).toContainText('발행 관리');
  24 |     await expect(page.locator('h3')).toContainText('포스팅 관리');
  25 |   });
  26 | 
  27 |   test('should navigate to Settings page', async ({ page }) => {
  28 |     await page.click('text=설정');
  29 |     await expect(page.locator('h2')).toContainText('설정');
  30 |   });
  31 | });
  32 | 
```