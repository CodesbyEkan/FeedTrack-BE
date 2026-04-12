import { ENV } from '../config/env.js';
import { transporter } from '../config/transporter.js';

export const sendComplaintEmail = async ({ ownerEmail, ownerName, businessName, guestName, message, type }) => {
  const mailOptions = {
    from: `"GuestPulse" <${ENV.EMAIL_USER}>`,
    to: ownerEmail,
    subject: `New ${type} received — ${businessName}`,
    html: `
      <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:12px;">
        <div style="background:#1B2D5B;padding:20px 24px;border-radius:8px 8px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:20px;">GuestPulse</h1>
          <p style="color:#94a3b8;margin:4px 0 0;font-size:13px;">Feedback Notification</p>
        </div>
        <div style="background:#fff;padding:24px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;">
          <p style="font-size:15px;color:#1e293b;">Hi <strong>${ownerName}</strong>,</p>
          <p style="font-size:14px;color:#475569;">A new <strong>${type}</strong> has been submitted for <strong>${businessName}</strong>.</p>
          
          <div style="background:#f1f5f9;border-left:4px solid #1B2D5B;padding:16px;border-radius:4px;margin:20px 0;">
            <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748b;letter-spacing:0.05em;">GUEST MESSAGE</p>
            <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.6;">"${message}"</p>
          </div>

          <table style="width:100%;border-collapse:collapse;font-size:13px;color:#475569;">
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;">Guest Name</td>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${guestName || 'Anonymous'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;">Type</td>
              <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;text-transform:capitalize;">${type}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-weight:600;">Received</td>
              <td style="padding:8px 0;">${new Date().toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}</td>
            </tr>
          </table>

          <a href="https://guestpulse.netlify.app" 
             style="display:inline-block;margin-top:20px;background:#1B2D5B;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;">
            View on Dashboard →
          </a>

          <p style="margin-top:24px;font-size:12px;color:#94a3b8;">
            You're receiving this because you have an active GuestPulse account. 
            Log in to assign staff and update the complaint status.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};