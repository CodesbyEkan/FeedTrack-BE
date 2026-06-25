import axios from "axios";
import { ENV } from "../config/env.js";

export async function createWhatsAppTemplate() {
  const url = `https://graph.facebook.com/${ENV.WHATSAPP_API_VERSION}/${ENV.WABA_ID}/message_templates`;

  const payload = {
    name: "complaint_assigned_staff",

    language: "en",

    category: "UTILITY",

    components: [
      {
        type: "BODY",

        text: `Hello {{1}},

A new customer complaint has been assigned to you.

Complaint ID: {{2}}
Customer Name: {{3}}
Category: {{4}}
Priority: {{5}}

Complaint Details:
{{6}}

Please review and update the complaint status.`,

        example: {
          body_text: [
            [
              "David",
              "CMP-2026-00125",
              "John Doe",
              "Billing",
              "High",
              "Payment was deducted twice",
            ],
          ],
        },
      },
    ],
  };

  const response = await axios.post(
    url,

    payload,

    {
      headers: {
        Authorization: `Bearer ${ENV.WHATSAPP_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    },
  );
  console.log(response.data);
  return response.data;
}

createWhatsAppTemplate();

// module.exports = createWhatsAppTemplate;
