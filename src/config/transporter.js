import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

export const transporter = nodemailer.createTransport({
  host:   ENV.SMTP_HOST,
  port:   Number(ENV.SMTP_PORT) || 587,
  secure: Number(ENV.SMTP_PORT) === 465,
  auth: {
    user: ENV.EMAIL_USER,
    pass: ENV.EMAIL_PASS,
  },
});