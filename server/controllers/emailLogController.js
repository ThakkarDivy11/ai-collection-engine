const EmailLog = require("../models/EmailLog");

exports.getEmailLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 50;
        const skip = (page - 1) * limit;

        const query = {};
        
        const isSuperAdmin = req.user.role === "superadmin";
        if (isSuperAdmin && req.query.adminId) {
            // Super Admin drill-down: filter by specific admin's clients
            const targetClients = await require("../models/Client").find({ createdBy: req.query.adminId }).select("email");
            const targetClientEmails = targetClients.map(c => c.email);
            query.recipientEmail = { $in: targetClientEmails };
        } else if (!isSuperAdmin) {
            // Normal Admin: filter by their own clients
            const myClients = await require("../models/Client").find({ createdBy: req.user._id }).select("email");
            const myClientEmails = myClients.map(c => c.email);
            query.recipientEmail = { $in: myClientEmails };
        }

        if (req.query.status && req.query.status !== 'all') {
            query.status = req.query.status;
        }

        const logs = await EmailLog.find(query)
            .sort({ sentAt: -1 }) // Newest first
            .skip(skip)
            .limit(limit);

        const total = await EmailLog.countDocuments(query);

        res.json({
            logs,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalLogs: total
        });
    } catch (error) {
        console.error("Error fetching email logs:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
