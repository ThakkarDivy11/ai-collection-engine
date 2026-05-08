const Client = require("../models/Client");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

exports.getDashboardStats = async (req, res) => {
    try {
        const { type = "monthly" } = req.query;
        const totalClients = await Client.countDocuments();
        const churnRiskCount = await Client.countDocuments({ status: "churn-risk" });

        // Active Revenue: Sum of all completed payments
        const payments = await Payment.find({ status: "completed" });
        const totalRevenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

        // Total Outstanding: Sum of all unpaid and overdue invoices
        const outstandingInvoices = await Invoice.find({ status: { $in: ["unpaid", "overdue"] } });
        const totalOutstanding = outstandingInvoices.reduce((acc, curr) => acc + curr.amount, 0);

        // Specifically Overdue
        const overdueAmount = outstandingInvoices
            .filter(i => i.status === "overdue")
            .reduce((acc, curr) => acc + curr.amount, 0);

        // Recent Clients
        const recentClients = await Client.find()
            .select("name company status createdAt")
            .sort({ createdAt: -1 })
            .limit(5);

        // Transformation for frontend display with actual revenue calculation
        const transformedRecentClients = await Promise.all(recentClients.map(async (client) => {
            const clientPayments = await Payment.find({
                clientId: client._id,
                status: "completed"
            });
            const clientRevenue = clientPayments.reduce((acc, curr) => acc + curr.amount, 0);

            return {
                name: client.name,
                company: client.company,
                status: client.status.charAt(0).toUpperCase() + client.status.slice(1),
                revenue: `₹${clientRevenue.toLocaleString()}`,
                date: formatRelativeDate(client.createdAt)
            };
        }));

        // Chart Data based on type
        const chartData = [];
        const now = new Date();

        if (type === "weekly") {
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(now.getDate() - i);
                const dayName = days[d.getDay()];
                const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
                const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59);

                const dayPayments = await Payment.find({
                    status: "completed",
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                });
                const dayRevenue = dayPayments.reduce((acc, curr) => acc + curr.amount, 0);
                const dayClients = await Client.countDocuments({
                    createdAt: { $gte: startOfDay, $lte: endOfDay }
                });

                chartData.push({ name: dayName, revenue: dayRevenue, clients: dayClients });
            }
        } else if (type === "yearly") {
            for (let i = 4; i >= 0; i--) {
                const year = now.getFullYear() - i;
                const startOfYear = new Date(year, 0, 1);
                const endOfYear = new Date(year, 11, 31, 23, 59, 59);

                const yearPayments = await Payment.find({
                    status: "completed",
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                });
                const yearRevenue = yearPayments.reduce((acc, curr) => acc + curr.amount, 0);
                const yearClients = await Client.countDocuments({
                    createdAt: { $gte: startOfYear, $lte: endOfYear }
                });

                chartData.push({ name: year.toString(), revenue: yearRevenue, clients: yearClients });
            }
        } else {
            // Default: Monthly (last 7 months)
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
                const monthName = months[d.getMonth()];
                const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
                const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59);

                const monthPayments = await Payment.find({
                    status: "completed",
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                });
                const monthRevenue = monthPayments.reduce((acc, curr) => acc + curr.amount, 0);
                const monthClients = await Client.countDocuments({
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                });

                chartData.push({ name: monthName, revenue: monthRevenue, clients: monthClients });
            }
        }

        res.json({
            totalClients,
            totalRevenue,
            totalOutstanding,
            overdueAmount,
            churnRiskCount,
            recentClients: transformedRecentClients,
            chartData
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function formatRelativeDate(date) {
    const diff = new Date() - new Date(date);
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 60) return `${mins} mins ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
}
