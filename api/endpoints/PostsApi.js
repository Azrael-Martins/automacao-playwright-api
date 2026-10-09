class PostsApi {
  constructor(apiClient) {
    this.client = apiClient;
  }

  async listPosts() {
    const response = await this.client.get('/posts');
    return { response, body: await response.json() };
  }

  async getPostById(id) {
    const response = await this.client.get(`/posts/${id}`);
    return { response, body: await response.json() };
  }
}

module.exports = { PostsApi };
