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
            const { data, error } = await resend.emails.send({
                from: `${process.env.SENDER_NAME || "CollectAI"} <onboarding@resend.dev>`, // Resend free tier requirement
                to: [to],
                subject,
                text,
                html,
            });
            if (error) throw error;
            console.log("✅ Resend success:", data.id);
            return data;
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