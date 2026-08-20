require('dotenv').config();

const { LOGIN_USERNAME, LOGIN_PASSWORD } = process.env;

if (!LOGIN_USERNAME || !LOGIN_PASSWORD) {
  throw new Error('LOGIN_USERNAME e LOGIN_PASSWORD devem estar definidos no arquivo .env');
}

module.exports = {
  validUser: {
    username: LOGIN_USERNAME,
    password: LOGIN_PASSWORD,
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
};