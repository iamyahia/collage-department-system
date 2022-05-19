const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  let mailOptions = {
    from: "finalptoject@gmail.com", // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    html: text, // plain text body
  };

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      secureConnection: false,
      auth: {
        user: "finalptoject@gmail.com",
        pass: "Final22Project",
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });

    await transporter.sendMail(mailOptions).then(() => {
      console.log("Email send succesfully");
    });
  } catch (err) {
    console.log(err);
  }
};

module.exports = sendMail;
