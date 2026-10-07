const { test, expect } = require('../../../fixtures/api.fixture');
const { expectJsonResponse } = require('../../../helpers/responseAssertions');
const { buildUsuario } = require('../../../api/data/builders/usuario.builder');

test.describe('Criar usuário', () => {
  test('POST /usuarios cadastra usuário com sucesso', async ({ usuariosApi }) => {
    const payload = buildUsuario();
    const response = await usuariosApi.create(payload);
    const body = await expectJsonResponse(response, 201);

    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
  });
});
