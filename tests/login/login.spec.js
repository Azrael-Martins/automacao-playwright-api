const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/loginPage');
const { validUser, invalidUser } = require('../../data/loginData');

test('@smoke Login valido no SauceDemo', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visit();
  await loginPage.login(validUser.username, validUser.password);

  await expect(page).toHaveURL(/inventory\.html/);
  await expect(page.getByText('Products', { exact: true })).toBeVisible();
});

test('Login invalido exibe mensagem de erro', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visit();
  await loginPage.login(invalidUser.username, invalidUser.password);

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText(
    'Epic sadface: Username and password do not match any user in this service',
  );
  await expect(page).toHaveURL(/\/$/);
});

test('Login com campos vazios exibe mensagem de erro', async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.visit();
  await loginPage.submitEmptyLogin();

  await expect(loginPage.errorMessage).toBeVisible();
  await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
  await expect(page).toHaveURL(/\/$/);
});
