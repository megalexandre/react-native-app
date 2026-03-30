import { After, Before, Given, setDefaultTimeout, Then } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { Browser, chromium, Page } from 'playwright';

let browser: Browser;
let page: Page;

setDefaultTimeout(20 * 1000);

Before({ tags: '@card' }, async function () {
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  page = await context.newPage();
});

After({ tags: '@card' }, async function () {
  await page.close();
  await browser.close();
});

Given('I am logged in and on the dashboard page', async function () {
  await page.addInitScript(
    ({ sessionStorageKey, serializedSession }: { sessionStorageKey: string; serializedSession: string }) => {
      window.localStorage.setItem(sessionStorageKey, serializedSession);
    },
    {
      sessionStorageKey: 'app-payments.session',
      serializedSession: JSON.stringify({
        token: 'mock-jwt-token-demo',
        user: {
          id: '2',
          username: 'alexandre',
          name: 'Alexandre',
        },
      }),
    }
  );

  await page.goto('http://localhost:8081/dashboard', { waitUntil: 'networkidle' });

  await page.getByTestId('home-screen').waitFor({ state: 'visible', timeout: 15000 });
  const url = page.url();
  assert.ok(url.includes('http://localhost:8081/dashboard'), `Expected to be on dashboard, but was on ${url}`);
});

Then('I should see the card {string}', async function (cardTestId: string) {
  await page.getByTestId(cardTestId).waitFor({ state: 'visible', timeout: 10000 });
});

Then('the card {string} should have title {string}', async function (cardTestId: string, expected: string) {
  const locator = page.getByTestId(`${cardTestId}-title`);
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const actual = (await locator.textContent())?.trim();
  assert.equal(actual, expected);
});

Then('the card {string} should have subtitle {string}', async function (cardTestId: string, expected: string) {
  const locator = page.getByTestId(`${cardTestId}-subtitle`);
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const actual = (await locator.textContent())?.trim();
  assert.equal(actual, expected);
});

Then('the card {string} should have right slot text {string}', async function (cardTestId: string, expected: string) {
  const locator = page.getByTestId(`${cardTestId}-right-slot`);
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const actual = (await locator.textContent())?.trim();
  assert.equal(actual, expected);
});

Then('the card {string} should have content text {string}', async function (cardTestId: string, expected: string) {
  const locator = page.getByTestId(`${cardTestId}-content`);
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const actual = (await locator.textContent())?.trim() ?? '';
  assert.ok(actual.includes(expected), `Expected content to include "${expected}", but was "${actual}"`);
});

Then('the card {string} should have footer text {string}', async function (cardTestId: string, expected: string) {
  const locator = page.getByTestId(`${cardTestId}-footer`);
  await locator.waitFor({ state: 'visible', timeout: 10000 });
  const actual = (await locator.textContent())?.trim();
  assert.equal(actual, expected);
});
