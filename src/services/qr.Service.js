import QRCode from "qrcode";

export async function generateQRCode(url) {
  return await QRCode.toDataURL(url, {
    scale: 8,        // ~300px output
    margin: 2,
    color: {
      dark: "#1B2D5B",
      light: "#ffffff",
    },
  });
}