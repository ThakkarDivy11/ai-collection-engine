const cron = require("node-cron");
const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const aiController = require("../controllers/aiController");
const { calculateOverduePenalty } = require("../utils/penaltyUtils");
const EmailLog = require("../models/EmailLog");
const sendEmail = require("../utils/emailService");

const runDailyAutomation = async () => {
    console.log("--- Starting Daily Automation Cron Job (Overdue Invoices Only) ---");
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Fetch unpaid and overdue invoices that were NOT reminded today
        const invoices = await Invoice.find({
            status: { $ne: "paid" },
            lastReminderSent: { $ne: today }
        }).populate("clientId");

        let overdueCount = 0;

        for (const invoice of invoices) {
            const client = invoice.clientId;
            if (!client) continue;

            // Calculate penalty using the utility
            const { daysOverdue, finalAmount } = calculateOverduePenalty(invoice.amount, invoice.dueDate, invoice.status);

            // ONLY process if strictly overdue (daysOverdue > 0)
            if (daysOverdue <= 0) {
                continue;
            }

            overdueCount++;

            // Update status to overdue if applicable
            if (invoice.status !== "overdue") {
                invoice.status = "overdue";
                await invoice.save();
                console.log(`Invoice ${invoice.invoiceNumber} marked as OVERDUE (${daysOverdue} days).`);
            }
        
            // Determine suggested tone based on aging
            let suggestedTone = "Polite";
            if (daysOverdue > 21) {
                suggestedTone = "Legal";
            } else if (daysOverdue > 7) {
                suggestedTone = "Firm";
            }

            // Prepare data for AI Risk Scoring
            const invoiceData = {
                invoiceNumber: invoice.invoiceNumber,
                amount: invoice.amount,
                dueDate: invoice.dueDate,
                daysOverdue: daysOverdue,
                clientName: client.name,
                company: client.company,
                clientStatus: client.status,
                finalAmount
            };

            // Generate Refined AI Risk Analysis
            const { riskLevel, generatedMessage } =
                await aiController.getDetailedRiskAnalysis(invoiceData, suggestedTone);

            // Business Action based on Risk Level
            if (riskLevel === "High" && client.status !== "churn-risk") {
                client.status = "churn-risk";
                await client.save();
            }

            // Send the AI Generated Message
            const emailSubject = `${suggestedTone.toUpperCase()} Reminder: Invoice ${invoice.invoiceNumber} Overdue`;
            
            // Append final amount details and payment link
            let finalMessage = generatedMessage;
            finalMessage += `\n\nYour invoice is overdue. Total due amount: ₹${finalAmount.toLocaleString()}`;
            finalMessage += `\n(This includes overdue charges if applicable.)`;
            finalMessage += `\n\nYou can view and pay your invoice here: https://ai-collection-engineee.vercel.app/login`;

            try {
                const paymentLink = "https://ai-collection-engineee.vercel.app/login";
                await sendEmail({
                    to: client.email,
                    subject: emailSubject,
                    text: finalMessage,
                    html: `
                        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                            <div style="margin-bottom: 24px;">
                                ${generatedMessage.replace(/\n/g, "<br>")}
                            </div>
                            
                            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 24px; border-left: 4px solid #4f46e5;">
                                <p style="margin: 0; font-weight: bold; font-size: 18px; color: #4f46e5;">Amount Due: ₹${finalAmount.toLocaleString()}</p>
                                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">(Includes overdue charges if applicable)</p>
                            </div>

                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${paymentLink}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
                                    Pay Invoice Now
                                </a>
                            </div>

                            <p style="font-size: 13px; color: #94a3b8; text-align: center; margin-top: 40px;">
                                If you have already made the payment, please ignore this email.
                            </p>
                        </div>
                    `
                });
                
                // Update lastReminderSent to today to prevent duplicate emails
                invoice.lastReminderSent = today;
                await invoice.save();
                
                // Log the email in database
                await EmailLog.create({
                    recipientEmail: client.email,
                    clientName: client.name,
                    invoiceNumber: invoice.invoiceNumber,
                    subject: emailSubject,
                    content: finalMessage,
                    status: "sent"
                });

                console.log(`AI-generated reminder sent to ${client.email} for invoice ${invoice.invoiceNumber}`);
            } catch (emailError) {
                console.error(`Failed to send email to ${client.email}:`, emailError.message);
                
                // Log failed email attempt
                try {
                    await EmailLog.create({
                        recipientEmail: client.email,
                        clientName: client.name,
                        invoiceNumber: invoice.invoiceNumber,
                        subject: emailSubject,
                        content: finalMessage,
                        status: "failed",
                        error: emailError.message
                    });
                } catch (dbErr) {
                    console.error("Failed to save email log:", dbErr.message);
                }
            }

            // Wait 1.5 seconds between emails to avoid SMTP rate limiting/socket disconnects
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        console.log(`--- Daily Automation Completed. Sent reminders for ${overdueCount} overdue invoices. ---`);
    } catch (error) {
        console.error("Critical error in daily automation:", error.message);
    }
};

// Schedule for every day at 17:00 local time
const initCron = () => {
    console.log("Initializing daily automation cron job (Runs at 16:45 Asia/Kolkata)...");
    // 45 16 * * * runs every day at 16:45
    cron.schedule("45 16 * * *", () => {
        runDailyAutomation();
    }, {
        scheduled: true,
        timezone: "Asia/Kolkata"
    });
};

module.exports = {
    initCron,
    runDailyAutomation
};
