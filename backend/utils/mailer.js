// utils/mailer.js

const axios = require("axios");

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

exports.sendOTPEmail = async (email, otp) => {
  try {
    const response = await axios.post(
      BREVO_URL,
      {
        sender: {
          name: process.env.EMAIL_FROM_NAME,
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email,
          },
        ],

        subject: "Verify Your Email",

        htmlContent: `
          <div style="font-family:Arial;padding:20px">
            <h2>Verify Your Email</h2>

            <p>Your OTP is</p>

            <h1 style="letter-spacing:6px">${otp}</h1>

            <p>This OTP will expire in 5 minutes.</p>

            <br/>

            <small>Please do not share this OTP with anyone.</small>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log("✅ Email Sent:", response.data);
  } catch (err) {
    console.error(
      "❌ Brevo Error:",
      err.response?.data || err.message
    );

    throw new Error("Unable to send email.");
  }
};