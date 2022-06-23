const cardMy = require('../models/card');
const { ERROR_BAD, ERROR_NOTFOUND, SOME_ERROR } = require('../err');

module.exports.createCard = (req, res) => {
  const ownerMy = req.user._id;
  const { name, link } = req.body;
  cardMy.create({ name, link, owner: ownerMy })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageCard });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  cardMy.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOTFOUND.code).send({ message: ERROR_NOTFOUND.messageCard });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD.code).send({ data: err, message: ERROR_BAD.messageCard });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.getCard = (req, res) => {
  cardMy.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message }));
};

module.exports.likeCard = (req, res) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOTFOUND.code).send({ message: ERROR_NOTFOUND.messageLike });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageLike });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(ERROR_NOTFOUND.code).send({ message: ERROR_NOTFOUND.messageLike });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD.code).send({ message: ERROR_BAD.messageLike });
        return;
      }
      res.status(SOME_ERROR.code).send({ message: SOME_ERROR.message });
    });
};
