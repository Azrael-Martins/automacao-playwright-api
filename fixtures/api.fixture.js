const { test: base } = require('@playwright/test');
const { ApiClient } = require('../api/core/ApiClient');
const { PostsApi } = require('../api/endpoints/PostsApi');

const test = base.extend({
  apiClient: async ({ request }, use) => {
    await use(new ApiClient(request));
  },
  postsApi: async ({ apiClient }, use) => {
    await use(new PostsApi(apiClient));
  },
});

module.exports = { test };
