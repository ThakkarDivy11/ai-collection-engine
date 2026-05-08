const mongoose = require("mongoose");

const emailLogSchema = new mongoose.Schema(
    {
        recipientEmail: {
            type: String,
            required: true,
        },
        clientName: String,
        invoiceNumber: String,
        subject: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["sent", "failed"],
            default: "sent",
        },
        error: String,
        sentAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("EmailLog", emailLogSchema);
