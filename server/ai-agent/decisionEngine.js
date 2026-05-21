const { generateCompletion } = require("../services/aiService");

/**
 * Call Mistral AI to generate a personalized reminder message
 */
const generateReminderMessage = async (customerName, amountDue, dueDate, daysOverdue, actionType) => {
    let prompt = `You are a professional AI collections agent representing CollectAI. 
Write a short, polite email to a customer named ${customerName} reminding them about an unpaid invoice of ₹${amountDue} that was due on ${dueDate} (which is ${daysOverdue} days overdue).

CRITICAL RULES:
1. DO NOT use ANY placeholders like [Your Name], [Company Name], [Job Title], [Link], etc.
2. Sign off the email simply as "CollectAI Accounts Team".
3. Use the ₹ (Rupee) symbol for currency, NEVER use $.
4. Do not mention attaching a link. Just ask them to log into their dashboard to process the payment.`;

    if (actionType === "friendly") {
        prompt += " Keep the tone very gentle, as they might have just forgotten.";
    } else if (actionType === "email") {
        prompt += " Keep it professional but clear that the payment is required soon.";
    } else {
        prompt += " Make it formal and state that the account may face suspension if not resolved.";
    }

    try {
        return await generateCompletion(prompt, "You are a professional AI collections agent.");
    } catch (error) {
        console.error("AI Generation Error in decisionEngine:", error.message);
        // Fallback message just in case AI is not responding
        return `Hello ${customerName},\n\nThis is a gentle reminder that your invoice of ₹${amountDue} was due on ${dueDate}. Please log into your dashboard and arrange payment at your earliest convenience.\n\nBest regards,\nCollectAI Accounts Team`;
    }
};

/**
 * Core decision logic determining the next best action
 */
const decideAction = async (invoice, client) => {
    const today = new Date();
    const due = new Date(invoice.dueDate);
    const timeDiff = today.getTime() - due.getTime();
    const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysOverdue <= 0) {
        return { action: "none", message: "Not overdue yet" };
    }

    let actionType = "";
    if (daysOverdue < 3) {
        actionType = "friendly"; 
    } else if (daysOverdue >= 3 && daysOverdue <= 10) {
        actionType = "email";
    } else {
        actionType = "escalate";
    }

    const message = await generateReminderMessage(
        client.name,
        invoice.amount,
        due.toLocaleDateString(),
        daysOverdue,
        actionType
    );

    return {
        action: actionType,
        daysOverdue,
        message,
    };
};

module.exports = {
    decideAction,
};
