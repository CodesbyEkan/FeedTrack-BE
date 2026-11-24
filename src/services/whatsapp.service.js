import axios from "axios";
import { ENV } from "../config/env.js";

const v = [
  "David",
  "CMP-2026-00125",
  "John Doe",
  "Billing",
  "High",
  "Payment was deducted twice",
];

export async function sendTemplateMessage({ phone, variables }) {
  const url = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",

    // to: phone,
    to: String(phone).replace(/\D/g, ""),

    type: "template",

    template: {
      name: "complaint_assigned_staffs",

      language: {
        code: "en",
      },

      components: [
        {
          type: "body",

          parameters: variables.map((value) => ({
            type: "text",
            text: String(value),
          })),
        },
      ],
    },
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_ACCESS_TOKEN}`,

        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    // console.log(err);
     const e = err.response?.data?.error;
    console.error(
      "WhatsApp failed:",
      err.response?.status,
      e?.code,
      e?.error_subcode,
      e?.message,
      e?.error_data?.details,
    );
    return null;
  }
}

// sendTemplateMessage({ phone: "2347082893494", variables: v });
