/* eslint-disable no-prototype-builtins */
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

const _ = {};
const { messages, status, jsonStatus } = require('./api.response');

_.verifyToken = function(token) {
  try {
    return jwt.verify(token, process.env.TOKEN, function(err, decoded) {
      return err ? err.message : decoded; // return true if token expired
    });
  } catch (error) {
    return error ? error.message : error;
  }
};
_.catchError = (name, error, req, res) => {
  _.handleCatchError(error);
  return res.status(status.InternalServerError).jsonp({
    status: jsonStatus.InternalServerError,
    message: messages.error
  });
};

_.handleCatchError = (error) => {
  console.log('**********ERROR***********', error);
};

_.validateEmail = async(email) => {
  const sRegexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return !!(email.match(sRegexEmail));
};

_.pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

_.chunk = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    const chunks = array.slice(i, i + size);
    result.push(chunks);
  }
  return result;
};

_.hashPassword = async(password) => {
  return bcryptjs.hash(password, 5);
};

_.comparePassword = async(password, hashPassword) => {
  return bcryptjs.compare(password, hashPassword);
};

_.validateMobile = (mobile) => {
  return !mobile.match(/^\d{10}$/);
};

module.exports = _;
