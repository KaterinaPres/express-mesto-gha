const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUsersMy = require('./routes/users');
const routerCardsMy = require('./routes/cards');
// Слушаем 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  //   useCreateIndex: true,
  //   useFindAndModify: false
});

app.use((req, res, next) => {
  req.user = {
    _id: '62b333b2e6dfa1351bf42542', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/', routerUsersMy);
app.use('/', routerCardsMy);
app.use('*', (req, res) => {
  res.status(404).send('Извините, такого роута не существует');
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  /* eslint-disable no-console */
  console.log(`App listening on port ${PORT}`);
});
