require('./env');
const app = require('./middleware/');
const mongo = require('./database/mongoose');

app.initialize();
mongo.initialize();

module.exports = app;
