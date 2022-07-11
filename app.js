const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsersMy = require('./routes/users');
const routerCardsMy = require('./routes/cards');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('./controllers/user');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  // useCreateIndex: true,
  // useFindAndModify: false
});

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  }),
}), createUser);

// app.use((req, res, next) => {
//   req.user = {
//     _id: '62b333b2e6dfa1351bf42542', // вставьте сюда _id созданного в предыдущем пункте пользователя
//   };

//   next();
// });

app.use('/', routerUsersMy);
app.use('/', routerCardsMy);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Извините, такого роута не существует' });
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
});
