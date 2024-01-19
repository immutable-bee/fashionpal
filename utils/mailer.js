import { createTransport } from "nodemailer";
import * as notify from "../pages/api/notifier/notify";

let transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export default async function sendMail(to, subject, html) {
  try {
    let info = await transporter.sendMail({
      from: `"BiblioPal" <${process.env.EMAIL_FROM}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("Message sent: %s", info.messageId);

    return info;
  } catch (error) {
    notify.error(error);
    console.error("Failed to send email:", error);
    throw error;
  }
}
