const cardMy = require('../models/card');

module.exports.createCard = (req, res) => {
  const ownerMy = req.user._id;
  const { name, link } = req.body;
  cardMy.create({ name, link, owner: ownerMy })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ data: err, message: 'Переданы некорректные данные при создании карточки' });
      }
    });
  // console.log(req.user._id);
};

module.exports.deleteCard = (req, res) => {
  cardMy.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        // console.log(req.user._id);
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ data: err, message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getCard = (req, res) => {
  cardMy.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(404).send({ message: 'Запрашиваемая карточка не найдена' }));
};

module.exports.likeCard = (req, res) => {
  cardMy.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
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
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};
