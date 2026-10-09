import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

// Sending domain verified in Resend (DNS records live in Vercel DNS).
const EMAIL_DOMAIN = "decorativefloorregister.com";

export const EMAIL_FROM = {
  orders: `Decorative Floor Register <orders@${EMAIL_DOMAIN}>`,
  contact: `Decorative Floor Register <hello@${EMAIL_DOMAIN}>`,
  careers: `Sanjay Overseas Careers <careers@${EMAIL_DOMAIN}>`,
};

// The sending domain has no inbox, so customer replies go to the store owner.
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "deepakbrass@gmail.com";
