const { apiKey } = require('../../config/environment');

// Cliente HTTP base: monta path relativo e delega ao request do Playwright
class ApiClient {
  constructor(request, resourcePath = '') {
    this.request = request;
    this.resourcePath = resourcePath.replace(/^\/+|\/+$/g, '');
  }

  _url(path = '') {
    if (!path) {
      return this.resourcePath;
    }
    const segment = path.replace(/^\/+/, '');
    return this.resourcePath ? `${this.resourcePath}/${segment}` : segment;
  }

  _defaultHeaders(extra = {}) {
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...extra,
    };
    if (apiKey) {
      headers.Authorization = `Bearer ${apiKey}`;
    }
    return headers;
  }

  async get(path = '', options = {}) {
    return this.request.get(this._url(path), {
      ...options,
      headers: this._defaultHeaders(options.headers),
    });
  }

  async post(path = '', options = {}) {
    return this.request.post(this._url(path), {
      ...options,
      headers: this._defaultHeaders(options.headers),
    });
  }

  async put(path = '', options = {}) {
    return this.request.put(this._url(path), {
      ...options,
      headers: this._defaultHeaders(options.headers),
    });
  }

  async patch(path = '', options = {}) {
    return this.request.patch(this._url(path), {
      ...options,
      headers: this._defaultHeaders(options.headers),
    });
  }

  async delete(path = '', options = {}) {
    return this.request.delete(this._url(path), {
      ...options,
      headers: this._defaultHeaders(options.headers),
    });
  }
}

module.exports = { ApiClient };
