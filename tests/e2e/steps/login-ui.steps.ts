import { After, Before, Given, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';
import { Browser, chromium, Page } from 'playwright';

let browser: Browser;
let page: Page;

Before(async function () {
  browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  page = await context.newPage();
});

After(async function () {
  await page.close();
  await browser.close();
});

Given('I open the login screen in the browser', async function () {
  await page.goto('http://localhost:8081/login', { waitUntil: 'networkidle' });
  await page.getByTestId('login-title').waitFor({ state: 'visible' });
});

When('I type username {string} and password {string}', async function (username: string, password: string) {
  await page.getByTestId('login-username').fill(username);
  await page.getByTestId('login-password').fill(password);
});

When('I click the login button', async function () {
  await page.getByTestId('login-submit').click({ force: true });
});

Then('I should see the welcome screen', async function () {
  await page.getByTestId('home-screen').waitFor({ state: 'visible' });
  const url = page.url();
  assert.ok(url.includes('http://localhost:8081'));
});

Then('I should see the login error message {string}', async function (expectedMessage: string) {
  const isUsernameMessage = expectedMessage.toLowerCase().includes('usuário');
  const targetTestId = isUsernameMessage ? 'login-username-error' : 'login-password-error';
  const errorText = page.getByTestId(targetTestId);
  await errorText.waitFor({ state: 'visible' });
  const actualMessage = (await errorText.textContent())?.trim();
  assert.equal(actualMessage, expectedMessage);
});

Then('I should see the login toast message {string}', async function (expectedMessage: string) {
  await page.getByTestId('login-toast').waitFor({ state: 'visible' });
  const toastText = page.getByTestId('login-toast-message');
  await toastText.waitFor({ state: 'visible' });
  const actualMessage = (await toastText.textContent())?.trim();
  assert.equal(actualMessage, expectedMessage);
});
