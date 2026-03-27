import { Before, Then, When } from '@cucumber/cucumber';
import assert from 'node:assert/strict';

import type { AuthError, LoginResponse } from '@/services/auth-model';
import type { login as loginFn } from '@/services/auth-service';

let login: typeof loginFn;
let response: LoginResponse | null;
let error: AuthError | null;

Before(async function () {
  response = null;
  error = null;
  process.env.EXPO_PUBLIC_USE_MOCK_API = 'true';
  delete process.env.EXPO_PUBLIC_API_URL;

  ({ login } = await import('@/services/auth-service'));
});

When(
  'I login with username {string} and password {string}',
  async function (username: string, password: string) {
    try {
      response = await login({ username, password });
    } catch (err: unknown) {
      error = err as AuthError;
    }
  }
);

Then('I receive a valid auth token', function () {
  assert.equal(error, null, `Expected success but got error: ${error?.message}`);
  assert.ok(response?.token);
});

Then('the authenticated username should be {string}', function (expectedUsername: string) {
  assert.equal(response?.user.username, expectedUsername);
});

Then('login should fail with message {string}', function (expectedMessage: string) {
  assert.ok(error);
  assert.equal(error?.message, expectedMessage);
});
