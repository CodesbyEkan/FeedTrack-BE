import express from "express";
import { generateQRCode } from "../services/qr.Service.js";

const router = express.Router();

router.get("/qr", async (req, res) => {
  try {
    const qr = await generateQRCode("https://myfrontend.com");//url to be edited once form is created
    res.send(`<img src="${qr}" />`);
  } catch (error) {
    res.status(500).send("QR generation failed");
  }
});

export default router;