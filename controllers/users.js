const userMy = require('../models/user');

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
  }
  userMy.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.getUser = (req, res) => {
  userMy.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Запрашиваемый пользователь не найден' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userMy.create({ name, about, avatar })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(404).send({ message: ' Запрашиваемый пользователь не найден' });
    });
};

module.exports.getUserByID = (req, res) => {
  userMy.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userMy.findByIdAndUpdate(
    req.user._id, // временное решение авторизации (req.user._id)
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(400).send({ message: 'Пользователь по указанному _id не найден' });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по-умолчанию' });
    });
};
