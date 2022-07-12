const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regUrl } = require('../token/MongoError');
const {
  getCard, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

// const regUrl = "/https?:\/\/(www\.)?[-a-z0-9-._~:/?#@!$&'()*+,;=]+/;";
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(new RegExp(regUrl)),
  }),
}), createCard);

router.get('/cards', getCard);
router.delete('/:cardId', celebrate({

  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), deleteCard);

router.put('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), likeCard);

router.delete('/:cardId/likes', celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required(),
  }),
  headers: Joi.object().keys({
    authorization: Joi.string(),
  }).unknown(true),
}), dislikeCard);

module.exports = router;
