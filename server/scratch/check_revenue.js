const mongoose = require("mongoose");
const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
require("dotenv").config();

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB Connected");

        const clients = await Client.find();
        console.log("Total Clients:", clients.length);

        for (const client of clients) {
            const payments = await Payment.find({ clientId: client._id });
            const invoices = await Invoice.find({ clientId: client._id });
            const totalRevenue = payments.filter(p => p.status === "completed").reduce((acc, curr) => acc + curr.amount, 0);
            const totalInvoiced = invoices.reduce((acc, curr) => acc + curr.amount, 0);
            
            console.log(`Client: ${client.name} (${client._id})`);
            console.log(`  Revenue (Paid): ₹${totalRevenue}, Invoiced: ₹${totalInvoiced}`);
            console.log(`  Payments: ${payments.length}, Invoices: ${invoices.length}`);
        }

        const allPayments = await Payment.find();
        console.log("Total Payments in DB:", allPayments.length);
        console.log("Payments Statuses:", allPayments.map(p => p.status));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkData();
