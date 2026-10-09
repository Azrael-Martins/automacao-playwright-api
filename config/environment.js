require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'https://jsonplaceholder.typicode.com';

module.exports = {
  API_BASE_URL,
};
