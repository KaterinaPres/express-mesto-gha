const cardMy = require('../models/card');
const BadError = require('../errors/BadError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const SomeError = require('../errors/SomeError');
const ForbiddenError = require('../errors/ForbiddenError'); // 403

module.exports.createCard = (req, res, next) => {
  const ownerMy = req.user._id.toString();
  const { name, link } = req.body;
  cardMy.create({ name, link, owner: ownerMy })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  cardMy.findById(req.params.cardId)
    .orFail(() => next(new NotFoundError('Карточка с указанным _id не найдена')))
    .then((card) => {
      if (req.user._id.toString() !== card.owner.toString()) {
        next(new ForbiddenError(ForbiddenError.message));
        return;
      }
      cardMy.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ data: card }))
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      if (err.errors) {
        const errorKeys = Object.keys(err.errors);
        const error = err.errors[errorKeys[0]];
        if (err.name === 'ValidationError') {
          next(new BadError(`Карточка с указанным _id не найдена. ${error}`));
          return;
        }
      }
      if (err.name === 'CastError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.getCard = (req, res, next) => {
  cardMy.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => next(new SomeError('Ошибка по умолчанию.')))
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Передан несуществующий _id карточки'));
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError());
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};
