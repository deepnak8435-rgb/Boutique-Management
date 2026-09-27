const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "gmail", // Configurable for Ethereal / Gmail / SendGrid
  auth: {
    user: process.env.EMAIL_USER || "dewaniboutique.official@gmail.com",
    pass: process.env.EMAIL_PASS || "demo_smtp_pass_123",
  },
});

// Send Appointment Confirmation Email
async function sendBookingConfirmationEmail(customerEmail, customerName, bookingDetails) {
  try {
    const serviceName = bookingDetails.slot?.service?.name || "Boutique Service";
    const dateStr = bookingDetails.slot?.date
      ? new Date(bookingDetails.slot.date).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Date Scheduled";
    const timeStr = `${bookingDetails.slot?.startTime || ""} - ${bookingDetails.slot?.endTime || ""}`;
    const price = bookingDetails.slot?.service?.price || 0;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f1e2eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background-color: #321f2b; padding: 24px; text-align: center; color: #ffffff;">
          <h1 style="font-family: 'Georgia', serif; margin: 0; font-size: 24px;">Dewani Boutique</h1>
          <p style="color: #f7a8ca; margin-top: 4px; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">Elegance in Every Stitch</p>
        </div>

        <div style="padding: 32px; background-color: #fffafc;">
          <h2 style="color: #321f2b; margin-top: 0;">Appointment Confirmed! ✨</h2>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">Dear <strong>${customerName}</strong>,</p>
          <p style="color: #666; font-size: 14px; line-height: 1.6;">Your boutique fitting and styling session at Dewani Boutique has been successfully confirmed. Below are your appointment details:</p>

          <div style="background-color: #ffffff; border: 1px solid #f1e2eb; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="margin: 6px 0; color: #321f2b; font-size: 14px;"><strong>Service:</strong> ${serviceName}</p>
            <p style="margin: 6px 0; color: #321f2b; font-size: 14px;"><strong>Date:</strong> ${dateStr}</p>
            <p style="margin: 6px 0; color: #321f2b; font-size: 14px;"><strong>Time Window:</strong> ${timeStr}</p>
            <p style="margin: 6px 0; color: #db2777; font-size: 16px;"><strong>Fitting Fee:</strong> ₹${price}</p>
          </div>

          <p style="color: #888; font-size: 12px; line-height: 1.5;">Please arrive 10 minutes prior to your scheduled time. If you need to reschedule, manage your booking on your profile dashboard.</p>
        </div>

        <div style="background-color: #f9f0f5; padding: 16px; text-align: center; color: #999; font-size: 11px;">
          &copy; ${new Date().getFullYear()} Dewani Boutique Management System. All rights reserved.
        </div>
      </div>
    `;

    // In local development mode without real SMTP creds, log email confirmation mock
    console.log(`📧 [EMAIL NOTIFICATION MOCK] Sent appointment confirmation to ${customerEmail}`);

    /* If production SMTP is configured:
    await transporter.sendMail({
      from: '"Dewani Boutique" <dewaniboutique.official@gmail.com>',
      to: customerEmail,
      subject: `Appointment Confirmed - Dewani Boutique (${serviceName})`,
      html: htmlContent,
    });
    */

    return true;
  } catch (err) {
    console.error("Error sending confirmation email:", err);
    return false;
  }
}

module.exports = {
  sendBookingConfirmationEmail,
};
