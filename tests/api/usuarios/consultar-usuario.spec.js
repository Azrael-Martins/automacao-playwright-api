const { test, expect } = require('../../../fixtures/api.fixture');
const { expectJsonResponse } = require('../../../helpers/responseAssertions');

test.describe('Consultar usuário', () => {
  test('GET /usuarios lista usuários cadastrados', async ({ usuariosApi }) => {
    const response = await usuariosApi.list();
    const body = await expectJsonResponse(response, 200);

    expect(typeof body.quantidade).toBe('number');
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });
});
