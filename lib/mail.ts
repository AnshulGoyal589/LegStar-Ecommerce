import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // Or your preferred SMTP provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendAdminOrderNotification(orderData: any) {
  const { orderId, customerName, customerEmail, customerPhone, items, total, shippingAddress, discount } = orderData;

  const itemsHtml = items.map((item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size}/${item.color})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
    </tr>
  `).join("");

  const mailOptions = {
    from: `"LegStar Orders" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `🚀 New Order Received: #${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">New Order Placed!</h1>
          <p style="margin: 5px 0 0;">Order ID: #${orderId}</p>
        </div>
        
        <div style="padding: 20px;">
          <h3 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Customer Details</h3>
          <p><strong>Name:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${customerEmail}</p>
          <p><strong>Phone:</strong> ${customerPhone}</p>
          <p><strong>Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>

          <h3 style="border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 30px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f9f9f9;">
                <th style="text-align: left; padding: 10px;">Item</th>
                <th style="text-align: center; padding: 10px;">Qty</th>
                <th style="text-align: right; padding: 10px;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <div style="margin-top: 20px; text-align: right; line-height: 1.6;">
            <p style="margin: 0;">Discount: <span style="color: #d32f2f;">-₹${discount}</span></p>
            <p style="margin: 0; font-size: 18px; font-weight: bold;">Total Amount: ₹${total}</p>
          </div>
        </div>

        <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p>This is an automated notification from your LegStar E-commerce dashboard.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}