const { checkToken } = require('../token/jwt');
const userMy = require('../models/user');
const NotAutorization = require('../errors/NotAutorization'); // 401

module.exports = (req, res, next) => {
  const authMy = req.cookies.jwt;
  if (!authMy) {
    throw new NotAutorization();
  }
  let payload;
  try {
    payload = checkToken(authMy);
    userMy.findOne({ _id: payload._id })
      .then((user) => {
        if (!user) {
          next(new NotAutorization());
          return;
        }
        req.user = { _id: user._id };
        next();
      })
      .catch(next);
  } catch (err) {
    next(new NotAutorization('Авторизуйтесь для доступа'));
    return;
  }
  req.user = { _id: payload._id };
  next();
};
