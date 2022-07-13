class NotFoundError extends Error {
  constructor() {
    super('Карточка или пользователь не найден, или был запрошен несуществующий роут');
    this.name = 'NotFoundError';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
