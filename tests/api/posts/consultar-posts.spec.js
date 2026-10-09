const { expect } = require('@playwright/test');
const { test } = require('../../../fixtures/api.fixture');
const { existingPostId } = require('../../../api/data/posts.data');
const { postListSchema, postSchema } = require('../../../api/schemas/posts.schema');
const { expectOkJson } = require('../../../helpers/responseAssertions');

test.describe('Posts', () => {
  test('Consultar lista de posts retorna 200 e array valido', async ({ postsApi }) => {
    const { response, body } = await postsApi.listPosts();

    expectOkJson(response, 200);
    expect(postListSchema(body)).toBe(true);
  });

  test('Consultar post por id retorna dados do recurso', async ({ postsApi }) => {
    const { response, body } = await postsApi.getPostById(existingPostId);

    expectOkJson(response, 200);
    expect(postSchema(body)).toBe(true);
    expect(body.id).toBe(existingPostId);
  });
});
