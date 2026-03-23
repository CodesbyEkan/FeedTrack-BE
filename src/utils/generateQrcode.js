import express from "express";
import QRCode from "qrcode";

const router = express.Router();

export async function generateQRCode(url) {

   return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: "#1B2D5B",
      light: "#ffffff",
    },
  });
}


//import { generateQRCode } from "../services/qr.Service.js";



router.get("/qr/:businessId", async (req, res) => {
  try { 
    const {businessId} = req.params ;
     const requiredUrl = `https://guestpulse.netlify.app/?businessId=${businessId}`;
    // const requiredUrl = `https://guestpulse-hospitality-management.netlify.app?businessId=${businessId}`

    //const requiredUrl = `http://127.0.0.1:8080?businessId=${businessId}`;

    const qr = await generateQRCode(requiredUrl);   //url to be edited once form is created

//     res.send(`<img src="${qr}" />`);
//   } catch (error) {
//     res.status(500).send("QR generation failed");
//   }
// });

// export default router;

res.status(200).json({
      message: "QR code generated successfully",
      qrCode: qr,
      link: requiredUrl, // helpful for testing
    });

  } catch (error) {
    res.status(500).json({
      message: "QR generation failed",
      error: error.message,
    });
  }
});

export default router;