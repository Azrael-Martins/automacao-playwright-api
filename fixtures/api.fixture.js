const base = require('@playwright/test');
const { UsuariosApi } = require('../api/endpoints/UsuariosApi');

const test = base.test.extend({
  usuariosApi: async ({ request }, use) => {
    await use(new UsuariosApi(request));
  },
});

module.exports = { test, expect: base.expect };
