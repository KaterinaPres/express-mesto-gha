const jwt = require('jsonwebtoken');
require('dotenv').config();

const { NODE_ENV = 'production', JWT_SECRET = 'secret' } = process.env;

const generateToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });

const checkToken = (token) => jwt.verify(token, JWT_SECRET);
module.exports = { generateToken, checkToken };