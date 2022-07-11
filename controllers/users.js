const userMy = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { generateToken } = require('../token/jwt');
require('dotenv').config();
// const { BadError, NotFoundError, SomeError } = require('../err');
// const { MONGO_DUPLICATE_ERROR_CODE } = require('../utils/utils');
const BadError = require('../errors/BadError'); // 400
const NotAutorization = require('../errors/NotAutorization'); // 401
const NotFoundError = require('../errors/NotFoundError'); // 404
const Mongo = require('../errors/Mongo'); // 409
const SomeError = require('../errors/SomeError'); // 500

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  if (!avatar) {
    res.status(BadError.code).send({ message: BadError.messageUser });
  }
  userMy.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'BadError') {
        throw new BadError('Переданы некорректные данные при создании пользователя');
      } else {
        next(err);
      }
    })
    .catch(next);
};

//         res.status(NotFoundError.code).send({ message: NotFoundError.messageUser });
//         return;
//       }
//       res.status(200).send({ data: user });
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         res.status(BadError.code).send({ message: BadError.messageUser });
//         return;
//       }
//       res.status(SomeError.code).send({ message: SomeError.message });
//     });
// };

module.exports.getUser = (req, res) => {
  userMy.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch(() => res.status(SomeError.code).send({ message: SomeError.message }));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password, } = req.body;
  
  bcrypt
    .hash(password, 10)
    .then((hash) => UserMy.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name, about, avatar, email, _id: user._id,
    }))
    .catch((err) => {
      if (err.code === MONGO_ERROR) {
        next(new Mongo('Пользователь с таким email уже существует'));
        return;
      }


  // userMy.create({ name, about, avatar })
  //   .then((user) => res.status(200).send({ data: user }))
  //   .catch((err) => {
  //     if (err.name === 'ValidationError') {
  //       res.status(BadError.code).send({ message: BadError.messageUser });
  //       return;
  //     }
  //     res.status(SomeError.code).send({ message: SomeError.message });
    });
};

module.exports.getUserByID = (req, res) => {
  userMy.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(NotFoundError.code).send({ message: NotFoundError.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BadError.code).send({ message: BadError.messageUser });
        return;
      }
      res.status(SomeError.code).send({ message: SomeError.message });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userMy.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .then((user) => {
      if (!user) {
        res.status(BadError.code).send({ message: BadError.messageUser });
        return;
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BadError.code).send({ message: BadError.messageUser });
        return;
      }
      res.status(SomeError.code).send({ message: SomeError.message });
    });
};
