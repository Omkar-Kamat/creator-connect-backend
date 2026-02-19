
import nodemailer from "nodemailer";

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  console.log(process.env.EMAIL_ID)
  console.log(process.env.EMAIL_PASS)

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_ID,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  return transporter;
};

export default getTransporter;
