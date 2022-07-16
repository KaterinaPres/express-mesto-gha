class NotFoundError extends Error {
  constructor(message) {
    let messageText;
    if (typeof message === 'undefined') {
      messageText = 'Карточка или пользователь не найден, или был запрошен несуществующий роут';
    } else {
      messageText = message;
    }
    super(messageText);
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
