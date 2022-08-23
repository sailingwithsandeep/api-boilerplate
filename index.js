require('./env');
const app = require('./app/App');
const mongo = require('./app/database/mongoose');

app.initialize();
mongo.initialize();

module.exports = app;
