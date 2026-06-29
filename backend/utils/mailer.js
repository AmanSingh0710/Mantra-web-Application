//utils/mailer.js

const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: Number(process.env.BREVO_PORT),
    secure: true,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP VERIFY ERROR:", error);
    } else {
        console.log("SMTP Server is ready");
    }
});

async function testSMTP() {
  try {
    await transporter.verify();
    console.log("✅ SMTP Connected");
  } catch (err) {
    console.error("❌ SMTP ERROR");
    console.error(err);
  }
}

testSMTP();

console.log({
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  user: process.env.BREVO_USER,
  from: process.env.MAIL_FROM
});

exports.sendOTPEmail = async (email, otp) => {

    try {

        const info = await transporter.sendMail({

            from: `"LifeInfotech" <${process.env.MAIL_FROM}>`,

            to: email,

            subject: "Password Reset OTP",

            html: `
                <div style="font-family:Arial">
                    <h2>Password Reset</h2>

                    <p>Your OTP is</p>

                    <h1>${otp}</h1>

                    <p>This OTP is valid for 10 minutes.</p>
                </div>
            `
        });

        console.log("Mail Sent:", info.messageId);

    } catch (err) {

        console.error(err);

        throw err;

    }

};