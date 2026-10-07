// Dados fixos para testes; o spec atual usa o builder para emails únicos
const usuarioBase = {
  nome: 'Usuario Teste',
  email: 'usuario.teste@qa.com.br',
  password: 'teste',
  administrador: 'false',
};

// ServeRest responde 400 (não 404) para id inválido — útil em testes negativos futuros
const usuarioIdInexistente = '000000000000000000000000';

module.exports = {
  usuarioBase,
  usuarioIdInexistente,
};
