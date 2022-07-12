const cardMy = require('../models/card');
const BadError = require('../errors/BadError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const SomeError = require('../errors/SomeError'); // 500
const ForbiddenError = require('../errors/ForbiddenError'); // 403

module.exports.createCard = (req, res, next) => {
  const ownerMy = req.user._id.toString();
  const { name, link } = req.body;
  cardMy.create({ name, link, owner: ownerMy })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  cardMy.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (req.user._id.toString() !== card.owner.toString()) {
        throw new ForbiddenError(ForbiddenError.message);
      }

      cardMy.deleteOne({ card })
        .then(() => {
          res.status(200).send({ message: 'Карточка удалена!' });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'BadError') {
        throw new BadError('Переданы некорректные данные при создании карточки');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.getCard = (req, res) => {
  cardMy.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(next);
};

module.exports.likeCard = (req, res) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadError('Переданы некорректные данные для постановки/снятия лайка');
      } else {
        next(err);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Переданы некорректные данные для постановки/снятия лайка');
      } else {
        next(err);
      }
    })
    .catch(next);
};
