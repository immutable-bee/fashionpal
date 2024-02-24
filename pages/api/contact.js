import { createTransport } from "nodemailer";

const transporter = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { name, email, phone, comment } = req.body;

      // Simple form validation
      if (!name || !email || !comment) {
        return res
          .status(400)
          .json({ success: false, message: "Incomplete form data" });
      }

      // Construct the email body
      const emailBody = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Comment:</strong> ${comment}</p>
      `;

      // Send the email
      await transporter.sendMail({
        from: `"FashionPal" <${process.env.EMAIL_FROM}>`,
        to: "natepeterson.fitness@gmail.com",
        subject: "Contact Us Form Submission",
        html: emailBody,
      });

      res
        .status(200)
        .json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json(error);
    }
  } else {
    res.status(405).json({ success: false, message: "Method Not Allowed" });
  }
}
