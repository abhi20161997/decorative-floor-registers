// Branded email templates for Decorative Floor Registers
// Uses inline CSS for maximum email client compatibility
// Colors: background #faf6f1, text #2c2420, accent #9a7b4f

interface OrderItem {
  product_name: string;
  variant_desc: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string | null;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
}

interface ShippingNotificationData {
  orderId: string;
  customerName: string;
  trackingNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
}

function emailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Decorative Floor Registers</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f0eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2c2420;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f0eb;">
    <tr>
      <td align="center" style="padding: 32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #faf6f1; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(44, 36, 32, 0.08);">
          <!-- Header -->
          <tr>
            <td style="background-color: #2c2420; padding: 24px 32px; text-align: center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: bold; color: #c9a96e; letter-spacing: 4px;">DFR</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 4px;">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 11px; color: #d4c5b0; letter-spacing: 3px; text-transform: uppercase;">Decorative Floor Registers</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #2c2420; padding: 24px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; color: #c9a96e; letter-spacing: 2px;">DFR</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-size: 12px; color: #d4c5b0; line-height: 1.6;">
                    Questions? Contact us at
                    <a href="mailto:deepakbrass@gmail.com" style="color: #c9a96e; text-decoration: underline;">deepakbrass@gmail.com</a><br>
                    or call <a href="tel:+18473161395" style="color: #c9a96e; text-decoration: underline;">+1 847-316-1395</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top: 12px; font-size: 11px; color: #7a6f66;">
                    &copy; ${new Date().getFullYear()} Decorative Floor Registers. All rights reserved.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function itemsTable(items: OrderItem[]): string {
  const rows = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e8e0d6; font-size: 14px; color: #2c2420;">
            ${item.product_name}<br>
            <span style="font-size: 12px; color: #7a6f66;">${item.variant_desc}</span>
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e8e0d6; text-align: center; font-size: 14px; color: #2c2420;">
            ${item.quantity}
          </td>
          <td style="padding: 10px 12px; border-bottom: 1px solid #e8e0d6; text-align: right; font-size: 14px; color: #2c2420;">
            ${formatCurrency(item.total_price)}
          </td>
        </tr>`
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 16px;">
      <thead>
        <tr style="background-color: #f0e9e0;">
          <th style="padding: 10px 12px; text-align: left; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: 600; color: #9a7b4f; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #9a7b4f;">
            Item
          </th>
          <th style="padding: 10px 12px; text-align: center; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: 600; color: #9a7b4f; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #9a7b4f;">
            Qty
          </th>
          <th style="padding: 10px 12px; text-align: right; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: 600; color: #9a7b4f; text-transform: uppercase; letter-spacing: 1px; border-bottom: 2px solid #9a7b4f;">
            Total
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>`;
}

function addressBlock(address: ShippingAddress, name: string): string {
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 24px; background-color: #f0e9e0; border-radius: 6px;">
      <tr>
        <td style="padding: 16px 20px;">
          <p style="margin: 0 0 4px; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: 600; color: #9a7b4f; text-transform: uppercase; letter-spacing: 1px;">Shipping To</p>
          <p style="margin: 0; font-size: 14px; color: #2c2420; line-height: 1.5;">
            ${name}<br>
            ${address.line1}<br>
            ${address.line2 ? address.line2 + "<br>" : ""}
            ${address.city}, ${address.state} ${address.zip}
          </p>
        </td>
      </tr>
    </table>`;
}

export function orderConfirmationEmail(data: OrderConfirmationData): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase();

  const content = `
    <!-- Order Confirmed heading -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align: center; padding-bottom: 24px;">
          <div style="display: inline-block; background-color: #f0e9e0; border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center; margin-bottom: 16px;">
            <span style="font-size: 28px; color: #9a7b4f;">&#10003;</span>
          </div>
          <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600; color: #2c2420;">
            Order Confirmed
          </h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #7a6f66;">
            Order #${shortId}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; font-size: 15px; color: #2c2420; line-height: 1.5;">
      Hi ${data.customerName},
    </p>
    <p style="margin: 0 0 24px; font-size: 15px; color: #2c2420; line-height: 1.5;">
      Thank you for your order! We&rsquo;re preparing your items for shipment. You&rsquo;ll receive a shipping notification with tracking information once your order ships.
    </p>

    <!-- Order details heading -->
    <h2 style="margin: 0 0 4px; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 600; color: #2c2420;">
      Order Details
    </h2>

    ${itemsTable(data.items)}

    <!-- Totals -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px;">
      <tr>
        <td style="padding: 4px 12px; font-size: 14px; color: #7a6f66;">Subtotal</td>
        <td style="padding: 4px 12px; font-size: 14px; color: #2c2420; text-align: right;">${formatCurrency(data.subtotal)}</td>
      </tr>
      ${
        data.discountAmount > 0
          ? `<tr>
        <td style="padding: 4px 12px; font-size: 14px; color: #2d8a4e;">Discount${data.discountCode ? ` (${data.discountCode})` : ""}</td>
        <td style="padding: 4px 12px; font-size: 14px; color: #2d8a4e; text-align: right;">-${formatCurrency(data.discountAmount)}</td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding: 4px 12px; font-size: 14px; color: #7a6f66;">Shipping</td>
        <td style="padding: 4px 12px; font-size: 14px; color: #2c2420; text-align: right;">${data.shippingCost === 0 ? "Free" : formatCurrency(data.shippingCost)}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 8px 12px 0;">
          <div style="border-top: 2px solid #9a7b4f;"></div>
        </td>
      </tr>
      <tr>
        <td style="padding: 8px 12px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 600; color: #2c2420;">Total</td>
        <td style="padding: 8px 12px; font-family: Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 600; color: #2c2420; text-align: right;">${formatCurrency(data.total)}</td>
      </tr>
    </table>

    ${addressBlock(data.shippingAddress, data.customerName)}

    <p style="margin: 24px 0 0; font-size: 13px; color: #7a6f66; line-height: 1.5; text-align: center;">
      If you have any questions about your order, please don&rsquo;t hesitate to reach out.
    </p>
  `;

  return emailWrapper(content);
}

export function shippingNotificationEmail(
  data: ShippingNotificationData
): string {
  const shortId = data.orderId.slice(0, 8).toUpperCase();

  const content = `
    <!-- Shipped heading -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="text-align: center; padding-bottom: 24px;">
          <div style="display: inline-block; background-color: #f0e9e0; border-radius: 50%; width: 56px; height: 56px; line-height: 56px; text-align: center; margin-bottom: 16px;">
            <span style="font-size: 28px; color: #9a7b4f;">&#9992;</span>
          </div>
          <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 600; color: #2c2420;">
            Your Order Has Shipped!
          </h1>
          <p style="margin: 4px 0 0; font-size: 13px; color: #7a6f66;">
            Order #${shortId}
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 16px; font-size: 15px; color: #2c2420; line-height: 1.5;">
      Hi ${data.customerName},
    </p>
    <p style="margin: 0 0 24px; font-size: 15px; color: #2c2420; line-height: 1.5;">
      Great news! Your order has been shipped and is on its way to you. Here are your tracking details:
    </p>

    <!-- Tracking box -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0e9e0; border-radius: 6px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px; text-align: center;">
          <p style="margin: 0 0 4px; font-family: Georgia, 'Times New Roman', serif; font-size: 12px; font-weight: 600; color: #9a7b4f; text-transform: uppercase; letter-spacing: 1px;">Tracking Number</p>
          <p style="margin: 0; font-size: 18px; font-weight: 600; color: #2c2420; letter-spacing: 1px;">
            ${data.trackingNumber}
          </p>
        </td>
      </tr>
    </table>

    <!-- Items summary -->
    <h2 style="margin: 0 0 4px; font-family: Georgia, 'Times New Roman', serif; font-size: 16px; font-weight: 600; color: #2c2420;">
      Items Shipped
    </h2>

    ${itemsTable(data.items)}

    ${addressBlock(data.shippingAddress, data.customerName)}

    <p style="margin: 24px 0 0; font-size: 14px; color: #2c2420; line-height: 1.5;">
      Estimated delivery is <strong>5&ndash;7 business days</strong> from the ship date. If you have any questions, please don&rsquo;t hesitate to contact us.
    </p>
  `;

  return emailWrapper(content);
}
