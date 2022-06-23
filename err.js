const ERROR_BAD = {
  code: 400, messageUser: 'Переданы некорректные данные при создании пользователя', messageCard: 'Переданы некорректные данные при создании карточки', messageLike: 'Переданы некорректные данные для постановки/снятия лайка',
};
const ERROR_NOTFOUND = {
  code: 404, messageUser: 'Пользователь по указанному _id не найден', messageCard: 'Карточка с указанным _id не найдена', messageLike: 'Передан несуществующий _id карточки',
};
const SOME_ERROR = { code: 500, message: 'Ошибка по-умолчанию' };

module.exports = {ERROR_BAD, ERROR_NOTFOUND, SOME_ERROR};
