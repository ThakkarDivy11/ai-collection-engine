const nodemailer = require("nodemailer");
const dns = require("dns");

// 🔥 Force IPv4 (important for Render issue fix)
dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465, // true only for 465
    family: 4, // 🔥 force IPv4 (main fix)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
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