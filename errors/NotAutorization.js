class NotAutorization extends Error {
  constructor() {
    super('Необходима авторизация');
    this.name = 'NotAutorization';
    this.statusCode = 401;
  }
}

module.exports = NotAutorization;
