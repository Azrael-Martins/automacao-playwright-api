function assertPostShape(post) {
  if (typeof post.id !== 'number') {
    throw new Error('post.id deve ser number');
  }
  if (typeof post.title !== 'string' || post.title.length === 0) {
    throw new Error('post.title deve ser string não vazia');
  }
  if (typeof post.body !== 'string') {
    throw new Error('post.body deve ser string');
  }
  if (typeof post.userId !== 'number') {
    throw new Error('post.userId deve ser number');
  }
}

function postListSchema(body) {
  if (!Array.isArray(body)) {
    throw new Error('resposta de lista de posts deve ser um array');
  }
  if (body.length === 0) {
    throw new Error('lista de posts não pode estar vazia');
  }
  body.forEach(assertPostShape);
  return true;
}

function postSchema(body) {
  assertPostShape(body);
  return true;
}

module.exports = { postListSchema, postSchema };
