class ForbiddenError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ForbiddenError';
      this.statusCode = 403;
      this.message = 'Нет прав для удаления карточки';
    }
  }
  
  module.exports = ForbiddenError;