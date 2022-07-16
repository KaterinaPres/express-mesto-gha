class NotAutorization extends Error {
  constructor(message) {
    let messageText;
    if (typeof message === 'undefined') {
      messageText = 'Необходима авторизация';
    } else {
      messageText = message;
    }
    super(messageText);
    this.name = 'NotAutorization';
    this.statusCode = 401;
  }
}

module.exports = NotAutorization;
