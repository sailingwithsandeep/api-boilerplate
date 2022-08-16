const mongoose = require('mongoose');

const { log } = require('../utils');

class MongoClient {
  constructor() {
    this.options = {

    };
  }

  initialize() {
    mongoose
      .connect(process.env.MONGO_URL, this.options)
      .then(() => log.yellow('Database connected!'))
      .catch((error) => {
        throw error;
      });
  }
}

module.exports = new MongoClient();
