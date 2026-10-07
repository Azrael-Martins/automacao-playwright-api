const { ApiClient } = require('../core/ApiClient');

// Endpoint ServeRest: /usuarios (ver Swagger)
class UsuariosApi extends ApiClient {
  constructor(request) {
    super(request, 'usuarios');
  }

  async list() {
    return this.get();
  }

  async getById(id) {
    return this.get(String(id));
  }

  async create(payload) {
    return this.post('', { data: payload });
  }

  async update(id, payload) {
    return this.put(String(id), { data: payload });
  }

  async remove(id) {
    return this.delete(String(id));
  }
}

module.exports = { UsuariosApi };
