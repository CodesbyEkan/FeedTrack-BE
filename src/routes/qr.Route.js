import express from "express";
import { generateQRCode } from "../services/qr.Service.js";

const router = express.Router();

router.get("/qr/:businessId", async (req, res) => {
  const { businessId } = req.params;

  // Validate businessId
  if (!businessId || !/^[a-zA-Z0-9_-]+$/.test(businessId)) {
    return res.status(400).json({ message: "Invalid businessId" });
  }

  try {
    //Should check out site url later
    const requiredUrl = `http://localhost:3000/?businessId=${encodeURIComponent(businessId)}`;
    const qrCode = await generateQRCode(requiredUrl);

    res.status(200).json({
      message: "QR code generated successfully",
      qrCode,
      link: requiredUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: "QR generation failed",
      error: error.message,
    });
  }
});

export default router;