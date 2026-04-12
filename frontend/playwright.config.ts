import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false, // Wails build can be heavy, run tests sequentially
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:34115',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // This is the key: Playwright will run this and wait for the URL to be ready
  webServer: {
    command: 'npm run dev', // Inside frontend, it runs vite. But for Wails, we need the full app.
    // However, since wails dev runs in the root, we'll try to use the root command.
    url: 'http://localhost:34115',
    reuseExistingServer: true,
    timeout: 180000, 
  },
});
