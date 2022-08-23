require('./env');
const app = require('./app');
const mongo = require('./database/mongoose');

app.initialize();
mongo.initialize();

module.exports = app;
