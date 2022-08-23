const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { messages, status, jsonStatus } = require('../utils');
const jwt = require('jsonwebtoken');
const jwtToken = process.env.TOKEN;

const middleware = {};

middleware.validate = function(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(status.UnprocessableEntity)
      .jsonp({ status: jsonStatus.UnprocessableEntity, errors: errors.array() });
  }
  next();
};

middleware.isUserAuthenticated = async(req, res, next) => {
  try {
    const token = req.header('Authorization');
    if (!token) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages.err_unauthorized
      });
    }
    req.user = {};
    let user;
    try {
      user = jwt.verify(token, jwtToken);
    } catch (err) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages.err_unauthorized
      });
    }
    if (!user) {
      return res.status(status.Unauthorized).jsonp({
        status: jsonStatus.Unauthorized,
        message: messages.err_unauthorized
      });
    }
    req.user = user;
    req.user._id = ObjectId(user._id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(status.UnprocessableEntity).jsonp({
        status: jsonStatus.UnprocessableEntity,
        errors: errors.array()
      });
    }
    return next();
  } catch (error) {
    return res.status(status.InternalServerError).jsonp({
      status: jsonStatus.InternalServerError,
      message: messages.error
    });
  }
};

module.exports = middleware;
