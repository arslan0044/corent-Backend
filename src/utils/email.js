import nodemailer from "nodemailer";
import config from "../config/env.js";

const transporter = nodemailer.createTransport({
  host: config.get("email.host"),
  port: config.get("email.port"),
  secure: config.get("email.secure"),
  auth: {
    user: config.get("email.user"),
    pass: config.get("email.pass"),
  },
});

export const sendEmail = async (to, subject, html) => {
  const info = await transporter.sendMail({
    from: config.get("email.user"),
    to,
    subject,
    html,
  });

  console.log(`Message sent: ${info.messageId}`);
};
