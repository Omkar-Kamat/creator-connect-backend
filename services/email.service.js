import dotenv from "dotenv"
dotenv.config()
import getTransporter from "../config/mailer.js";

class EmailService {
    static async sendOtpEmail(to, otp) {
        const mailOptions = {
            from: `"creatorConnect" ${process.env.EMAIL_ID}`,
            to,
            subject: "Your CreatorConnect Verification Code",
            html: `
        <h3>Verification Code</h3>
        <p>Your OTP is:</p>
        <h2>${otp}</h2>
        <p>This code will expire in 10 minutes.</p>
      `,
        };

        const transporter = getTransporter();
        await transporter.sendMail(mailOptions);
    }
}

EmailService.sendOtpEmail("omkar.12320650@lpu.in","456465")


export default EmailService;
