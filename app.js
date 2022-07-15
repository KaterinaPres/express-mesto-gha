const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const routerUsersMy = require('./routes/users');
const routerCardsMy = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const ForbiddenError = require('./errors/ForbiddenError');
const NotFoundError = require('./errors/NotFoundError');
const auth = require('./middlewares/auth');
const { regUrl } = require('./token/MongoError');

require('dotenv').config();

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
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
    avatar: Joi.string().pattern(new RegExp(regUrl)),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).required(),
  }),
}), createUser);

app.use('*', () => {
  throw new NotFoundError();
});

app.use(auth);

app.use('/', routerUsersMy);
app.use('/', routerCardsMy);
app.use('*', () => {
  throw new ForbiddenError();
});
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  if (statusCode !== 201 || statusCode !== 200) {
    res
      .status(statusCode)
      .send({
        message,
      });
    console.error(err.stack);
  } else {
    next(err);
  }
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
});
