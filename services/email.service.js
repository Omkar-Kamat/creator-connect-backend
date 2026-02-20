import nodemailer from "nodemailer";

export class EmailService {

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, otp) {
    try {

      if (!to) throw new Error("Recipient email is required");
      if (!subject) throw new Error("Email subject is required");
      if (!otp) throw new Error("OTP is required");

      const mailOptions = {
        from: `"CreatorConnect" <${process.env.EMAIL_USER}>`,
        to: to,
        subject: subject,
        html: `
        <h3>Verification Code</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
        `
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: info.messageId,
        message: "Email sent successfully"
      };

    } catch (error) {

      console.error("EmailService.sendEmail Error:", error.message);
      throw error;

    }
  }

}

export const emailService = new EmailService();