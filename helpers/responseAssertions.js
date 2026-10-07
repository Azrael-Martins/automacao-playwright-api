const { expect } = require('@playwright/test');

// Valida status e JSON; retorna o body já parseado para asserts no spec
async function expectJsonResponse(response, expectedStatus) {
  expect(response.status(), 'status HTTP').toBe(expectedStatus);
  const contentType = response.headers()['content-type'] || '';
  expect(contentType).toContain('application/json');
  return response.json();
}

module.exports = { expectJsonResponse };
