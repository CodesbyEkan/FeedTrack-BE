import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  EXPIRE_COOKIE: process.env.EXPIRE_COOKIE,
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_HOST: process.env.SMTP_HOST,
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID,
  WABA_ID: process.env.WABA_ID,
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION,
};
