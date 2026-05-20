const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/homepage/loginPage');


test('@e2e Logando no irisys', async ({ page }, testInfo) => {
  const loginPage = new LoginPage(page);

  const email = testInfo.config.metadata.email;
  const senha = testInfo.config.metadata.senha;

  await loginPage.acessarPagina();
  await loginPage.login(email, senha);
  await expect(page).toHaveURL(/home/);
  await expect( page.locator('[data-testid="menu-lateral"]') ).toBeVisible();
});


