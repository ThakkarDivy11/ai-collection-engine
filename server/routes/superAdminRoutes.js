const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Client = require("../models/Client");
const { protect, superAdmin } = require("../middleware/authMiddleware");

// @desc    Get all admins (including superadmins)
// @route   GET /api/super-admin/admins
// @access  Private/SuperAdmin
router.get("/admins", protect, superAdmin, async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password");
        res.json(admins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/admins-with-revenue", protect, superAdmin, async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("name email");
        const Payment = require("../models/Payment");
        
        const adminsWithRevenue = await Promise.all(admins.map(async (admin) => {
            // Find all clients created by this admin
            const clients = await Client.find({ createdBy: admin._id }).select("_id");
            const clientIds = clients.map(c => c._id);
            
            // Sum payments for these clients
            const payments = await Payment.find({ clientId: { $in: clientIds }, status: "completed" });
            const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
            
            return {
                ...admin.toObject(),
                totalRevenue,
                clientCount: clientIds.length
            };
        }));
        
        res.json(adminsWithRevenue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get system stats
// @route   GET /api/super-admin/stats
// @access  Private/SuperAdmin
router.get("/stats", protect, superAdmin, async (req, res) => {
    try {
        const totalAdmins = await User.countDocuments({ role: "admin" });
        const totalClients = await Client.countDocuments();
        const activeClients = await Client.countDocuments({ status: "active" });
        
        // Mock revenue data (you can update this with actual Payment model sum)
        const totalRevenue = 125000; 

        res.json({
            totalAdmins,
            totalClients,
            activeClients,
            totalRevenue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete an admin
// @route   DELETE /api/super-admin/admins/:id
// @access  Private/SuperAdmin
router.delete("/admins/:id", protect, superAdmin, async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);
        if (admin) {
            if (admin.role === "superadmin" && admin._id.toString() === req.user._id.toString()) {
                return res.status(400).json({ message: "You cannot delete yourself" });
            }
            await User.findByIdAndDelete(req.params.id);
            res.json({ message: "Admin removed" });
        } else {
            res.status(404).json({ message: "Admin not found" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
