const { API_BASE_URL } = require('../../config/environment');

class ApiClient {
  constructor(request) {
    this.request = request;
    this.baseURL = API_BASE_URL.replace(/\/$/, '');
    this.defaultHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
  }

  async get(path, options = {}) {
    return this.request.get(this.resolve(path), {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
    });
  }

  async post(path, data, options = {}) {
    return this.request.post(this.resolve(path), {
      ...options,
      data,
      headers: { ...this.defaultHeaders, ...options.headers },
    });
  }

  async put(path, data, options = {}) {
    return this.request.put(this.resolve(path), {
      ...options,
      data,
      headers: { ...this.defaultHeaders, ...options.headers },
    });
  }

  async delete(path, options = {}) {
    return this.request.delete(this.resolve(path), {
      ...options,
      headers: { ...this.defaultHeaders, ...options.headers },
    });
  }

  resolve(path) {
    const normalized = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseURL}${normalized}`;
  }
}

module.exports = { ApiClient };
