const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { default: isEmail } = require('validator/lib/isEmail');
const { regMatch } = require('../token/MongoError');
const NotAutorization = require('../errors/NotAutorization'); // 401

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validator: {
      validate: {
        match: [regMatch, 'Пожалуйста, заполните действительный URL-адрес'],
      },
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validator: {
      validate: {
        validator: (v) => isEmail(v),
        message: 'Заполните email в правльном формате',
      },
    },
  },
  password: {
    type: String,
    required: [true, 'Необходимо ввести пароль'],
    select: false,
  },
});

userSchema.statics.findUser = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) { return Promise.reject(new NotAutorization('Неверные почта или пароль')); }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { return Promise.reject(new NotAutorization('Неверные почта или пароль')); }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
