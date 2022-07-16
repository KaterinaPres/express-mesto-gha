class Conflict extends Error {
  constructor(message) {
    let messageText;
    if (typeof message === 'undefined') {
      messageText = 'Email уже занят';
    } else {
      messageText = message;
    }
    super(messageText);
    this.name = 'Conflict';
    this.statusCode = 409;
  }
}

module.exports = Conflict;
