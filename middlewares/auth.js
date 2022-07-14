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
    next(new NotAutorization('Авторизуйтесь для доступа'));
    return;
  }
  req.user = { _id: payload._id };
  next();
};
