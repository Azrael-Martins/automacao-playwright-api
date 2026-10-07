// Gera payload válido para POST /usuarios; email único evita 400 "email já utilizado"
function buildUsuario(overrides = {}) {
  const unique = Date.now();
  return {
    nome: `Usuario ${unique}`,
    email: `usuario.${unique}@qa.com.br`,
    password: 'teste',
    administrador: 'false',
    ...overrides,
  };
}

module.exports = { buildUsuario };
