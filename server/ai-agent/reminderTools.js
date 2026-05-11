const axios = require("axios");
const Invoice = require("../models/Invoice");
const VoiceCallLog = require("../models/VoiceCallLog");

// ─── Twilio (Voice) ──────────────────────────────────────────────────────────
const twilio = require("twilio");
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

const sendEmail = require("../utils/emailService");

// ─── Email Reminder ────────────────────────────────────────────────────────
/**
 * Send an email reminder using the central email service (Resend/SMTP)
 * @returns {{ success: boolean, actionStatus: "sent"|"failed" }}
 */
const sendEmailReminder = async (customerEmail, message) => {
    try {
        await sendEmail({
            to: customerEmail,
            subject: "Invoice Payment Reminder",
            text: message,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">Payment Reminder</h2>
                    <p>${message.replace(/\n/g, "<br/>")}</p>
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://ai-collection-engineee.vercel.app/login" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                            View & Pay Invoice
                        </a>
                    </div>
                    <p style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
                        If you have already paid, please ignore this email.
                    </p>
                </div>
            `,
        });

        console.log(`[AI Agent] Email sent successfully to ${customerEmail}`);
        return { success: true, actionStatus: "sent", tool: "email" };
    } catch (error) {
        console.error("[AI Agent] Email Failed:", error.message);
        return { success: false, actionStatus: "failed", tool: "email", error: error.message };
    }
};


// ─── AI Voice Call ─────────────────────────────────────────────────────────
/**
 * Trigger an AI voice call via Vapi (or Twilio TwiML as fallback)
 * @returns {{ success: boolean, actionStatus: "sent"|"failed" }}
 */
const triggerVoiceCall = async (customerPhone, customerName, invoiceId, amount, message) => {
    console.log(`[Voice] Triggering AI call to ${customerPhone}`);
    let callStatus = "failed";

    try {
        if (process.env.VAPI_API_KEY) {
            // ── Vapi AI voice call ──────────────────────────────────────────
            await axios.post(
                "https://api.vapi.ai/call/phone",
                {
                    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
                    customer: { number: customerPhone, name: customerName },
                    assistantId: process.env.VAPI_ASSISTANT_ID,
                    assistantOverrides: { firstMessage: message },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(`[Voice/Vapi] Call initiated to ${customerPhone}`);
            callStatus = "completed";
        } else if (twilioClient) {
            // ── Twilio TwiML fallback ───────────────────────────────────────
            await twilioClient.calls.create({
                twiml: `<Response><Say>${message}</Say></Response>`,
                to: customerPhone,
                from: process.env.TWILIO_PHONE_NUMBER || "+14155238886",
            });
            console.log(`[Voice/Twilio] Call placed to ${customerPhone}`);
            callStatus = "completed";
        } else {
            // ── Dev mock ────────────────────────────────────────────────────
            console.log(`[Voice Mock] Call to ${customerPhone}\n${message}`);
            callStatus = "completed";
        }
    } catch (error) {
        console.error("[Voice] Call failed:", error.message);
        callStatus = "failed";
    }

    // Always log to VoiceCallLog
    try {
        const log = new VoiceCallLog({
            customerName,
            invoiceId,
            callStatus,
            transcript: message,
            timestamp: new Date(),
        });
        await log.save();
    } catch (logErr) {
        console.error("[Voice] Failed to save call log:", logErr.message);
    }

    return {
        success: callStatus === "completed",
        actionStatus: callStatus === "completed" ? "sent" : "failed",
        tool: "call",
    };
};

// ─── Invoice Escalation ────────────────────────────────────────────────────
/**
 * Mark invoice as escalated/overdue
 * @returns {{ success: boolean, actionStatus: "sent"|"failed" }}
 */
const updateInvoiceStatus = async (invoiceId) => {
    console.log(`[Escalate] Updating invoice ${invoiceId} to 'overdue'`);
    try {
        await Invoice.findByIdAndUpdate(invoiceId, { status: "overdue" });
        return { success: true, actionStatus: "sent", tool: "escalate" };
    } catch (error) {
        console.error("[Escalate] Failed:", error.message);
        return { success: false, actionStatus: "failed", tool: "escalate" };
    }
};

// ─── Schedule Next Reminder ────────────────────────────────────────────────
const scheduleNextReminder = async (invoiceId) => {
    console.log(`[Scheduler] Next reminder queued for Invoice ${invoiceId}`);
    return { success: true };
};

module.exports = {
    sendEmailReminder,
    triggerVoiceCall,
    updateInvoiceStatus,
    scheduleNextReminder,
};
