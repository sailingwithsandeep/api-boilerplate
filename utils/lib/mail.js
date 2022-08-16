const nodemailer = require('nodemailer');
const _ = require('./helper');

const transporterOptions = {
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'sandeep.parmar@yudiz.com', // SMTP email
    pass: 'YudizSailing119' // Your password
  },
  secure: false
};
const transporter = nodemailer.createTransport(transporterOptions);

const sendMail = (data) => {
  const html = ` <div>Click the link below to reset your password</div><br/>
        <div><a href=${data.link}>Link</a></div>`;
  const mailOptions = {
    from: 'Medium',
    to: data.sEmail,
    subject: 'Reset Password Link',
    html
  };
  try {
    transporter.sendMail(mailOptions);
  } catch (error) {
    _.handleCatchError(error);
  }
};

module.exports = sendMail;
