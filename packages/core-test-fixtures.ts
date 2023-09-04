import { test as base } from '@playwright/test'

export const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    if (baseURL) {
      await page.goto(baseURL)
      await use(page) 
    }
  }
})
