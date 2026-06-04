// utils/verifyMobileOTP.js

const axios = require("axios");

exports.sendMobileOTP = async (
  mobile,
  otp
) => {

  try {

    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        flow_id:
          process.env.MSG91_FLOW_ID,

        sender: "LIFEIN",

        mobiles: `91${mobile}`,

        OTP: otp
      },
      {
        headers: {
          authkey:
            process.env.MSG91_AUTH_KEY,

          "Content-Type":
            "application/json"
        }
      }
    );

    console.log(
      "MSG91 RESPONSE:",
      response.data
    );

    return response.data;

  } catch (error) {

    console.log(
      "MSG91 ERROR:",
      error.response?.data ||
      error.message
    );

    throw new Error(
      "Failed to send OTP"
    );
  }
};