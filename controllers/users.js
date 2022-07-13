const bcrypt = require('bcrypt');
const validator = require('validator');
const userMy = require('../models/user');
const { generateToken } = require('../token/jwt');
require('dotenv').config();
// const { BadError, NotFoundError, SomeError } = require('../err');
const { MONGO_ERROR } = require('../token/MongoError');
const BadError = require('../errors/BadError'); // 400
const NotAutorization = require('../errors/NotAutorization'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const Mongo = require('../errors/Mongo'); // 409
// const SomeError = require('../errors/SomeError');

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  if (!avatar) {
    throw new BadError('Переданы некорректные данные при создании пользователя');
  }
  userMy.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'BadError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  userMy.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    const {
      name, about, avatar, email, password,
    } = req.body;
    bcrypt
      .hash(password, 10)
      .then((hash) => userMy.create({
        name, about, avatar, email, password: hash,
      }))
      .then((user) => res.status(201).send({
        name: user.name, about: user.about, email: user.email, avatar: user.avatar,
      }))
      .catch((err) => {
        if (err.code === MONGO_ERROR) {
          next(new Mongo(Mongo.message));
          return;
        }
        if (err.name === 'BadError') {
          next(new BadError('Переданы некорректные данные при создании карточки'));
          return;
        }
        next(err);
      });
  } else {
    throw new BadError('Некорректно указан Email');
  }
};

module.exports.getUserByID = (req, res, next) => {
  userMy.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.name === 'BadError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      if (err.name === 'NotAutorization') {
        next(new NotAutorization());
        return;
      }
      console.log(err.name);
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  userMy.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному _id не найден'));
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'BadError') {
        next(new BadError('Переданы некорректные данные при создании карточки'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  if (validator.isEmail(req.body.email)) {
    const { email, password } = req.body;
    return userMy.findUser(email, password)
      .then((user) => {
        const token = generateToken({ _id: user._id });
        res.cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        });
        res.send({ message: 'Проверка прошла успешно!' });
      })
      .catch(() => {
        next(new NotAutorization());
      });
  }
  throw new BadError('Некорректно указан Email');
};

module.exports.getUserMe = (req, res, next) => {
  userMy.findById(req.user._id)
    .then((user) => res.status(200).send({ user }))
    .catch(next);
};
