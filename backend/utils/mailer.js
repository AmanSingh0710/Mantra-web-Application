//utils/mailer.js

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"LifeInfotech" <${process.env.EMAIL}>`,
    to: email,
    subject: "Verify your Email",
    html: `
      <h2>Your OTP is:</h2>
      <h1>${otp}</h1>
      <p>Valid for 5 minutes</p>
    `
  });
};