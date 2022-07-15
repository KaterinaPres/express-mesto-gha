const { checkToken } = require('../token/jwt');
const NotAutorization = require('../errors/NotAutorization'); // 401

module.exports = (req, res, next) => {
  const authMy = req.cookies.jwt;
  if (!authMy) {
    throw new NotAutorization();
  }
  let payload;
  try {
    payload = checkToken(authMy);
  } catch (err) {
    throw new NotAutorization('Авторизуйтесь для доступа');
  }
  req.user = { _id: payload._id };
  next();
};
