class Mongo extends Error {
  constructor() {
    super('Email уже занят');
    this.name = 'Mongo';
    this.statusCode = 409;
    // this.message = 'Email уже занят';
  }
}

module.exports = Mongo;
