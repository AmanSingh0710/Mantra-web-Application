// utils/sendMobileOTP.js

const axios = require("axios");

exports.sendMobileOTP = async (mobile) => {
  try {

    const response = await axios.post("https://control.msg91.com/api/v5/otp",
      {
        mobile: `91${mobile}`,
        template_id: process.env.MSG91_TEMPLATE_ID,
        otp_length: 6
      },
      {
        headers: {
          authkey: process.env.MSG91_AUTH_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;

  } catch (error) {

    console.log("MSG91 ERROR:",error.response?.data || error.message
    );

    throw new Error("Failed to send OTP");
  }
};