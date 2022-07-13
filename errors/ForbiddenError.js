class ForbiddenError extends Error {
  constructor() {
    super('Нет прав для удаления карточки');
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    // this.message = 'Нет прав для удаления карточки';
  }
}

module.exports = ForbiddenError;
