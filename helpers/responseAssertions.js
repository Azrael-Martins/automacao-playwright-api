const { expect } = require('@playwright/test');

function expectOkJson(response, expectedStatus = 200) {
  expect(
    response.status(),
    `esperado HTTP ${expectedStatus}, recebido ${response.status()} em ${response.url()}`,
  ).toBe(expectedStatus);

  const contentType = response.headers()['content-type'] || '';
  expect(contentType, `Content-Type JSON em ${response.url()}`).toMatch(/application\/json/i);
}

function expectStatus(response, status) {
  expect(
    response.status(),
    `esperado HTTP ${status}, recebido ${response.status()} em ${response.url()}`,
  ).toBe(status);
}

module.exports = {
  expectOkJson,
  expectStatus,
};
