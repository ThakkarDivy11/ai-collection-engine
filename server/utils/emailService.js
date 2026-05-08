const nodemailer = require("nodemailer");
const dns = require("dns");

// 🔥 Force IPv4 (important for Render issue fix)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: Number(process.env.SMTP_PORT) === 465,
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000,
    family: 4,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS?.replace(/\s/g, ""), // Auto-remove spaces
    },
    tls: {
        rejectUnauthorized: false // Helps with some cloud network issues
    }
});

const sendEmail = async ({ to, subject, text, html, attachments }) => {
    try {
        const info = await transporter.sendMail({
            from: `"${process.env.SENDER_NAME || "Your App"}" <${process.env.SMTP_USER}>`,
            to,
            subject,
            text,
            html,
            attachments,
        });

        console.log("✅ Message sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Error sending email:", error);
        throw error;
    }
};

module.exports = sendEmail;