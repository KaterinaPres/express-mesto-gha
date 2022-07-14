const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regUrl } = require('../token/MongoError');
const {
  getUser, getUserMe, getUserByID, updateUser, updateAvatar,
} = require('../controllers/users');

router.get('/users', getUser);
router.get('/users/me', getUserMe);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserByID);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  })
    .unknown(true),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(new RegExp(regUrl)),
  }),
}), updateAvatar);

module.exports = router;
