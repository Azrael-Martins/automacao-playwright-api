const { test, expect } = require('@playwright/test');
const { UsuariosPage } = require('../../pages/usuariosPage');
const { expectJsonResponse } = require('../../helpers/responseAssertions');
const { buildUsuario } = require('../../data/builders/usuarioBuilder');

// Spec: orquestra Page Object + dados; não monta URL nem chama request.get/post direto
test.describe('ServeRest — Usuários', () => {
  test('POST /usuarios cadastra usuário com sucesso', async ({ request }) => {
    const usuariosPage = new UsuariosPage(request);
    const payload = buildUsuario();
    const response = await usuariosPage.create(payload);
    const body = await expectJsonResponse(response, 201);

    expect(body.message).toBe('Cadastro realizado com sucesso');
    expect(body._id).toBeTruthy();
  });

  test('GET /usuarios lista usuários cadastrados', async ({ request }) => {
    const usuariosPage = new UsuariosPage(request);
    const response = await usuariosPage.list();
    const body = await expectJsonResponse(response, 200);

    expect(typeof body.quantidade).toBe('number');
    expect(Array.isArray(body.usuarios)).toBeTruthy();
  });

  test('DELETE /usuarios/{_id} exclui usuário cadastrado', async ({ request }) => {
    const usuariosPage = new UsuariosPage(request);
    const createResponse = await usuariosPage.create(buildUsuario());
    const created = await expectJsonResponse(createResponse, 201);

    const deleteResponse = await usuariosPage.remove(created._id);
    const deleteBody = await expectJsonResponse(deleteResponse, 200);

    expect(deleteBody.message).toContain('Registro excluído com sucesso');
  });
});
