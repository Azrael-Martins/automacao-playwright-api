const { BasePage } = require('./basePage');

// Page Object do recurso ServeRest: /usuarios (ver Swagger)
class UsuariosPage extends BasePage {
  constructor(request) {
    super(request, 'usuarios');
  }

  async list() {
    return this.get(); // GET /usuarios
  }

  async getById(id) {
    return this.get(String(id));
  }

  async create(payload) {
    // { data } serializa o objeto como JSON no corpo da requisição
    return this.post('', { data: payload });
  }

  async update(id, payload) {
    return this.put(String(id), { data: payload });
  }

  async remove(id) {
    return this.delete(String(id));
  }
}

module.exports = { UsuariosPage };
