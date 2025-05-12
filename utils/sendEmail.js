import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com",
    pass: "your-email-password",
  },
});

const sendNotification = async (email, message) => {
  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Booking Update",
    text: message,
  };

  await transporter.sendMail(mailOptions);
};

export default sendNotification;
