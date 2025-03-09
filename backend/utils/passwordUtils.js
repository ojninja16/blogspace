const bcrypt = require('bcrypt');
const config = require('../config/config');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, config.SALT_ROUNDS);
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = {
  hashPassword,
  comparePassword
};