class BadError extends Error {
    constructor(message) {
      super(message);
      this.name = 'BadError';
      this.statusCode = 400;
      this.message = 'Переданы некорректные данные';
    }
  }
  
  module.exports = BadError;