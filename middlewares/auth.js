const { checkToken } = require('../token/jwt');
const userMy = require('../models/user');
const NotAutorization = require('../errors/NotAutorization'); // 401

module.exports = (req, res, next) => {
// const auth = (req, res, next) => {
  const authMy = req.cookies.jwt;
  if (!authMy) {
    next(new NotAutorization('Необходима авторизация для доступа'));
    return;
  }
//   const token = auth.replace('Bearer ', '');
  let payload;

  try {
    payload = checkToken(token);
    User.findOne({ _id: payload._id })
    .then((user) => {
      if (!user) {
        throw new NotAutorization(NotAutorization.message);
      }
      req.user = { _id: user._id };
      next();
    })
    .catch(next);
  } catch (err) {
    next(new NotAutorization('Необходима авторизация для доступа'));
  }
};