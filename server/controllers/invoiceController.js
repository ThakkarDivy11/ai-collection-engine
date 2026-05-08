const Invoice = require("../models/Invoice");
const Client = require("../models/Client");
const sendEmail = require("../utils/emailService");
const { calculateOverduePenalty } = require("../utils/penaltyUtils");

exports.createInvoice = async (req, res) => {
    try {
        const { clientId, amount, dueDate, invoiceNumber } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        const newInvoice = await Invoice.create({
            clientId,
            amount,
            dueDate,
            invoiceNumber,
        });

        // Calculate penalty for email
        const { finalAmount } = calculateOverduePenalty(amount, dueDate);

        // Send Invoice Email
        try {
            await sendEmail({
                to: client.email,
                subject: `New Invoice ${invoiceNumber} from CollectAI`,
                text: `Hello ${client.name},\n\nA new invoice has been generated for your company ${client.company}.\nTotal Amount: ₹${finalAmount.toLocaleString()}\nDue Date: ${new Date(dueDate).toLocaleDateString()}\n\n(This includes overdue charges if applicable.)\nPlease login to the portal to make payment.`,
                html: `<h3>Hello ${client.name},</h3><p>A new invoice has been generated for your company <b>${client.company}</b>.</p><p>Total Amount: <b>₹${finalAmount.toLocaleString()}</b><br>Due Date: <b>${new Date(dueDate).toLocaleDateString()}</b></p><p><i>(This includes overdue charges if applicable.)</i></p><p>Please login to the portal to make payment.</p>`,
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
        }

        res.status(201).json(newInvoice);
    } catch (error) {
        console.error("Invoice Creation Error:", error);
        res.status(500).json({ 
            message: "Internal Server Error", 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("clientId", "name company email");
        
        // Include penalty details for UI
        const updatedInvoices = invoices.map(inv => {
            const { finalAmount, penaltyAmount, daysOverdue } = calculateOverduePenalty(inv.amount, inv.dueDate, inv.status);
            const obj = inv.toObject();
            return { 
                ...obj, 
                amount: finalAmount, 
                originalAmount: inv.amount,
                penaltyAmount,
                daysOverdue
            };
        });

        res.json(updatedInvoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getClientInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find({ clientId: req.user._id });
        
        // Include penalty details for UI
        const updatedInvoices = invoices.map(inv => {
            const { finalAmount, penaltyAmount, daysOverdue } = calculateOverduePenalty(inv.amount, inv.dueDate, inv.status);
            const obj = inv.toObject();
            return { 
                ...obj, 
                amount: finalAmount, 
                originalAmount: inv.amount,
                penaltyAmount,
                daysOverdue
            };
        });

        res.json(updatedInvoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.downloadInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("clientId");
        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        const { generateInvoicePDF } = require("../utils/pdfService");
        const pdfBuffer = await generateInvoicePDF(invoice);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=Invoice_${invoice.invoiceNumber}.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
