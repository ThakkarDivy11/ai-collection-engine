const stripe = process.env.STRIPE_SECRET_KEY ? require("stripe")(process.env.STRIPE_SECRET_KEY) : null;
const Payment = require("../models/Payment");
const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const sendEmail = require("../utils/emailService");
const EmailLog = require("../models/EmailLog");

exports.createCheckoutSession = async (req, res) => {
    try {
        const { clientId, amount, invoiceId } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: invoiceId ? `Invoice Payment: ${invoiceId}` : `Payment for ${client.company}`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/customer-dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/customer-dashboard?status=cancel`,
            metadata: {
                clientId: clientId.toString(),
                invoiceId: invoiceId ? invoiceId.toString() : "",
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBulkCheckoutSession = async (req, res) => {
    try {
        const { clientId } = req.body;

        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }

        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured" });
        }

        // Fetch all unpaid / overdue invoices for this client
        const unpaidInvoices = await Invoice.find({
            clientId,
            status: { $in: ["unpaid", "overdue"] },
        });

        if (unpaidInvoices.length === 0) {
            return res.status(400).json({ message: "No outstanding invoices to pay." });
        }

        const totalAmount = unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const invoiceIds = unpaidInvoices.map((inv) => inv._id.toString()).join(",");

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `Pay All Outstanding Invoices – ${client.company} (${unpaidInvoices.length} bills)`,
                        },
                        unit_amount: Math.round(totalAmount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${process.env.FRONTEND_URL}/customer-dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/customer-dashboard?status=cancel`,
            metadata: {
                clientId: clientId.toString(),
                bulkPayment: "true",
            },
        });

        res.json({ id: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("❌ Webhook Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const { clientId, invoiceId, bulkPayment } = session.metadata;
        const amount = session.amount_total / 100;

        await Payment.create({
            clientId,
            amount,
            status: "completed",
            stripeId: session.id,
        });

        if (bulkPayment === "true" && clientId) {
            // Bulk payment – mark all unpaid/overdue invoices for this client as paid
            const unpaidInvoices = await Invoice.find({
                clientId,
                status: { $in: ["unpaid", "overdue"] }
            });

            for (const inv of unpaidInvoices) {
                inv.status = "paid";
                await inv.save();
                const populatedInv = await Invoice.findById(inv._id).populate("clientId");
                if (populatedInv && populatedInv.clientId) {
                    await sendPaymentSuccessEmail(populatedInv.clientId, populatedInv, populatedInv.amount);
                }
            }
        } else if (invoiceId) {
            const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, { status: "paid" }, { new: true }).populate("clientId");
            
            if (updatedInvoice && updatedInvoice.clientId) {
                await sendPaymentSuccessEmail(updatedInvoice.clientId, updatedInvoice, amount);
            }
        }
    }

    res.json({ received: true });
};

exports.getPayments = async (req, res) => {
    try {
        const isSuperAdmin = req.user.role === "superadmin";
        let query = {};

        if (isSuperAdmin && req.query.adminId) {
            // Drill-down for Super Admin: filter by a specific admin's clients
            const targetClients = await Client.find({ createdBy: req.query.adminId }).select("_id");
            const clientIds = targetClients.map(c => c._id);
            query = { clientId: { $in: clientIds } };
        } else if (!isSuperAdmin) {
            // Standard Admin: filter by their own clients
            const myClients = await Client.find({ createdBy: req.user._id }).select("_id");
            const clientIds = myClients.map(c => c._id);
            query = { clientId: { $in: clientIds } };
        }

        const payments = await Payment.find(query).populate("clientId", "name company email").sort({ createdAt: -1 });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.verifyPaymentSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured" });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const { clientId, invoiceId, bulkPayment } = session.metadata;
            const amount = session.amount_total / 100;

            // Check if payment already exists (prevent duplicates if webhook also works)
            const existingPayment = await Payment.findOne({ stripeId: session.id });
            if (!existingPayment) {
                await Payment.create({
                    clientId,
                    amount,
                    status: "completed",
                    stripeId: session.id,
                });

                if (bulkPayment === "true" && clientId) {
                    const unpaidInvoices = await Invoice.find({
                        clientId,
                        status: { $in: ["unpaid", "overdue"] }
                    });

                    for (const inv of unpaidInvoices) {
                        inv.status = "paid";
                        await inv.save();
                        const populatedInv = await Invoice.findById(inv._id).populate("clientId");
                        if (populatedInv && populatedInv.clientId) {
                            await sendPaymentSuccessEmail(populatedInv.clientId, populatedInv, populatedInv.amount);
                        }
                    }
                } else if (invoiceId) {
                    const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, { status: "paid" }, { new: true }).populate("clientId");
                    
                    if (updatedInvoice && updatedInvoice.clientId) {
                        await sendPaymentSuccessEmail(updatedInvoice.clientId, updatedInvoice, amount);
                    }
                }
            }
            return res.json({ success: true, status: "paid" });
        }

        res.json({ success: false, status: session.payment_status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const sendPaymentSuccessEmail = async (client, invoice, amount) => {
    const { generateInvoicePDF } = require("../utils/pdfService");
    const subject = `Payment Successful: Invoice ${invoice.invoiceNumber}`;
    const message = `Hello ${client.name},\n\nWe have successfully received your payment of ₹${amount.toLocaleString()} for Invoice #${invoice.invoiceNumber}.\n\nPlease find your payment receipt attached.\n\nThank you for your business!\n\nBest Regards,\nCollectAI Team`;

    try {
        const pdfBuffer = await generateInvoicePDF(invoice);

        await sendEmail({
            to: client.email,
            subject,
            text: message,
            html: `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #22c55e;">Payment Received</h2>
                <p>Hello <strong>${client.name}</strong>,</p>
                <p>We have successfully received your payment of <strong>₹${amount.toLocaleString()}</strong> for Invoice <strong>#${invoice.invoiceNumber}</strong>.</p>
                <p>Please find your payment receipt attached to this email.</p>
                <p>Thank you for your business!</p>
                <br>
                <p>Best Regards,<br><strong>CollectAI Team</strong></p>
            </div>`,
            attachments: [
                {
                    filename: `Invoice_${invoice.invoiceNumber}.pdf`,
                    content: pdfBuffer
                }
            ]
        });

        await EmailLog.create({
            recipientEmail: client.email,
            clientName: client.name,
            invoiceNumber: invoice.invoiceNumber,
            subject,
            content: message,
            status: "sent"
        });

        console.log(`Payment success email sent to ${client.email}`);
    } catch (error) {
        console.error("Failed to send payment success email:", error.message);
        await EmailLog.create({
            recipientEmail: client.email,
            clientName: client.name,
            invoiceNumber: invoice.invoiceNumber,
            subject,
            content: message,
            status: "failed",
            error: error.message
        });
    }
};
