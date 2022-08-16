const jwt = require('jsonwebtoken');
const UserModel = require('../model');
const { status, jsonStatus, messages, _, sendMail } = require('../../../utils');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcryptjs');

const authService = {};
authService.register = async(req, res) => {
  try {
    req.body = _.pick(req.body, ['sUserName', 'sEmail', 'sPassword', 'sMobile', 'sGender']);

    const {
      sEmail
    } = req.body;
    const userExist = await UserModel.findOne({ sEmail });
    if (userExist) {
      return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages.already_exist.replace('##', messages.email) });
    }

    const userData = new UserModel(req.body);
    const sToken = await userData.generateAuthToken();
    return res.status(status.OK).set('Authorization', sToken).jsonp({ status: jsonStatus.OK, data: userData, Authorization: sToken });
  } catch (error) {
    return _.catchError('authService.register', error, req, res);
  }
};

authService.login = async(req, res) => {
  try {
    req.body = _.pick(req.body, ['sEmail', 'sPassword']);
    const { sEmail, sPassword } = req.body;
    const user = await UserModel.findOne({ sEmail });
    if (!user) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages.auth_failed });
    const isMatch = await bcrypt.compare(sPassword, user.sPassword);
    if (!isMatch) {
      return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages.auth_failed });
    }
    if (user.aTokens.length > 5) user.aTokens.shift();
    const token = await user.generateAuthToken();

    return res.status(status.OK).set('Authorization', token).jsonp({ status: jsonStatus.OK, message: messages.succ_login, data: user, Authorization: token });
  } catch (error) {
    return _.catchError('authService.login', error, req, res);
  }
};

authService.resetLink = async(req, res) => {
  try {
    req.body = _.pick(req.body, ['sEmail']);
    const { sEmail } = req.body;
    const user = await UserModel.findOne({ sEmail });
    if (!user) {
      return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages.auth_failed });
    }
    const token = jwt.sign({ _id: sEmail }, process.env.TOKEN, {
      expiresIn: '12h'
    });
    const link = `${req.protocol}://${req.get('host')}api/user/auth/reset-password/v1'/${token}`;

    sendMail(
      {
        sEmail,
        link
      }
    );
    await UserModel.updateOne({ _id: user._id }, { sTempToken: token });
    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages.sent_success.replace('##', messages.email), data: {} });
  } catch (error) {
    return _.catchError('EmailTemplate.send', error, req, res);
  }
};

authService.resetPassword = async(req, res) => {
  try {
    req.body = _.pick(req.body, ['sNewPassword']);
    const { token } = req.params;
    const { sNewPassword } = req.body;
    const decoded = jwt.verify(token, process.env.TOKEN);
    const user = await UserModel.findOne({ sEmail: decoded._id }).lean();
    if (!user) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages.not_exist.replace('##', messages.user) });
    if (user.sTempToken.length === 0 || user.sTempToken === undefined) {
      return res.status(status.NotAcceptable).jsonp({ status: jsonStatus.NotAcceptable, message: messages.link_expire_invalid });
    }
    await UserModel.updateOne({ _id: user._id }, { $set: { aTokens: [], sTempToken: '', sPassword: bcrypt.hashSync(sNewPassword, 8) } });
    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages.reset_pass_succ });
  } catch (error) {
    return _.catchError('authService.resetPassword', error, req, res);
  }
};

authService.changePassword = async(req, res) => {
  try {
    req.body = _.pick(req.body, ['sOldPassword', 'sNewPassword']);
    const { sOldPassword, sNewPassword } = req.body;

    const user = await UserModel.findById(req.user._id).lean();
    if (!bcrypt.compareSync(sOldPassword, user.sPassword)) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages.wrong_old_field });
    if (sOldPassword === sNewPassword) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages.old_new_field_same });
    await UserModel.updateOne({ _id: ObjectId(user._id) }, { sPassword: bcrypt.hashSync(sNewPassword, 8) });

    return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages.update_success.replace('##', messages.password) });
  } catch (error) {
    return _.catchError('authService.changePassword', error, req, res);
  }
};

authService.logout = async(req, res) => {
  try {
    const sToken = req.header('Authorization');
    await UserModel.updateOne({ _id: ObjectId(req.user._id) }, { $pull: { aTokens: { sToken } } });
    return res.status(status.OK).jsonp({ status: jsonStatus.OK });
  } catch (error) {
    return _.catchError('UserAuth.logout', error, req, res);
  }
};

module.exports = authService;
