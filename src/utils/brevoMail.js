import axios from "axios";
import { ENV } from "../config/env.js";

export const sendMail = async ({ to, toName, subject, html }) => {
  const res = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "GuestPulse", email: ENV.MAIL_FROM },
      to: [{ email: to, name: toName || undefined }],
      subject,
      htmlContent: html,
    },
    {
      headers: {
        "api-key": ENV.BREVO_API_KEY,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      timeout: 15000,
    },
  );
  return res.data;
};