const express = require('express');
const router = new express.Router();
const validators = require('./validators');
const middleware = require('../../../middleware/middleware');
const authService = require('./services');

router.post('/user/auth/register/v1', validators.register, middleware.validate, authService.register);
router.post('/user/auth/login/v1', validators.login, middleware.validate, authService.login);
router.post('/user/auth/send-password-link/v1', authService.resetLink);
router.patch('/user/auth/reset-password/v1/:token', validators.resetPassword, middleware.validate, authService.resetPassword);
router.patch('/user/auth/change-password/v1', middleware.isUserAuthenticated, validators.changePassword, middleware.validate, authService.changePassword);
router.get('/user/auth/logout/v1', middleware.isUserAuthenticated, authService.logout);

module.exports = router;
