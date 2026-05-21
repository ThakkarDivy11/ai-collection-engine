const nodemailer = require("nodemailer");
const { Resend } = require("resend");
const dns = require("dns");

// 🔥 Force IPv4
dns.setDefaultResultOrder("ipv4first");

// Initialize Resend only if key exists
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Standard Transporter for Local/Fallback
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    family: 4,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s/g, ""),
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendEmail = async ({ to, subject, text, html, attachments }) => {
    try {
        // If Resend is configured, use it (Best for Render)
        if (resend) {
            console.log("📨 Using Resend to send email...");
            try {
                const { data, error } = await resend.emails.send({
                    from: `${process.env.SENDER_NAME || "CollectAI"} <info@aicollection.divythakkar.website>`, 
                    to: [to],
                    subject,
                    text,
                    html,
                    attachments,
                });
                if (error) throw error;
                console.log("✅ Resend success:", data.id);
                return data;
            } catch (resendError) {
                // If it is a validation error due to unverified domain on Resend (free tier)
                const isValidationError = 
                    resendError.name === 'validation_error' || 
                    resendError.statusCode === 403 || 
                    (resendError.message && resendError.message.includes("own email address"));

                if (isValidationError) {
                    const testEmail = "divythakkar318@gmail.com";
                    if (to !== testEmail) {
                        console.warn(`⚠️ Resend validation error. Redirecting email from <${to}> to verified test email <${testEmail}>...`);
                        const { data, error } = await resend.emails.send({
                            from: `${process.env.SENDER_NAME || "CollectAI"} <info@aicollection.divythakkar.website>`,
                            to: [testEmail],
                            subject: `[REDIRECTED from ${to}] ${subject}`,
                            text: `[This email was redirected to you because your Resend account is on the free tier and the domain is unverified. Original Recipient: ${to}]\n\n${text || ""}`,
                            html: `<div style="background:#fff3cd;color:#856404;border:1px solid #ffeeba;padding:15px;margin-bottom:20px;border-radius:4px;font-family:sans-serif;"><strong>Test Environment Redirect:</strong> This email was redirected to you because your Resend account is on the free tier and the domain is unverified. <br/><strong>Original Recipient:</strong> ${to}</div>${html || ""}`,
                            attachments,
                        });
                        if (error) throw error;
                        console.log("✅ Resend redirected success:", data.id);
                        return data;
                    }
                }
                
                // If it's a different error, log it and let it fall back to SMTP
                console.error("⚠️ Resend failed:", resendError.message || resendError, "- Falling back to SMTP...");
            }
        }

        // Fallback to Nodemailer (Best for Local)
        console.log("📨 Using SMTP (Nodemailer) to send email...");
        const info = await transporter.sendMail({
            from: `"${process.env.SENDER_NAME || "CollectAI"}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
            attachments,
        });

        console.log("✅ SMTP success:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;