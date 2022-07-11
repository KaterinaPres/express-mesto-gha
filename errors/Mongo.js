class Mongo extends Error {
    constructor(message) {
      super(message);
      this.name = 'Mongo';
      this.statusCode = 409;
      this.message = 'Email уже занят';
    }
  }
  
  module.exports = Mongo;