const cors = require('cors');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');

const { log } = require('./utils');
const { default: helmet } = require('helmet');
const morgan = require('morgan');

class App {
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.corsOptions = {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['*']
    };
  }

  initialize() {
    this.setupMiddleware();
    this.setupServer();
  }

  setupMiddleware() {
    this.app.use(cors(this.corsOptions));
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morgan('dev', { skip: (req) => req.path === '/ping' || req.path === '/favicon.ico' }));
    this.app.use('/api', [
      require('./model-routes-services/user/auth/routes')
    ]);
    this.app.use('*', this.routeHandler);
    this.app.use(this.logErrors);
    this.app.use(this.errorHandler);
  }

  async setupServer() {
    this.httpServer = http.Server(this.app);
    this.httpServer.timeout = 10000;
    this.httpServer.listen(process.env.PORT, '0.0.0.0', () => log.green(`Spinning on ${process.env.PORT}!`));
  };

  routeConfig(req, res, next) {
    if (req.path === '/ping') return res.status(200).send({});
    res.reply = ({ code, message }, data = {}, header = undefined) => {
      res.status(code).header(header).json({ message, data });
    };
    next();
  };

  routeHandler(req, res) {
    res.status(404);
    res.send({ message: 'Route not found' });
  };

  logErrors(err, req, res, next) {
    log.error(`${req.method} ${req.url}`);
    log.error('body -> ', req.body);
    log.error(err.stack);
    return next(err);
  };

  errorHandler(err, req, res, next) {
    res.status(500);
    res.send({ message: err });
  };
}

module.exports = new App();
