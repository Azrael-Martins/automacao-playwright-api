const { test, expect } = require('../../../fixtures/api.fixture');
const { expectJsonResponse } = require('../../../helpers/responseAssertions');
const { buildUsuario } = require('../../../api/data/builders/usuario.builder');

test.describe('Excluir usuário', () => {
  test('DELETE /usuarios/{_id} exclui usuário cadastrado', async ({ usuariosApi }) => {
    const createResponse = await usuariosApi.create(buildUsuario());
    const created = await expectJsonResponse(createResponse, 201);

    const deleteResponse = await usuariosApi.remove(created._id);
    const deleteBody = await expectJsonResponse(deleteResponse, 200);

    expect(deleteBody.message).toContain('Registro excluído com sucesso');
  });
});
