const express = require("express");
const router = express.Router();
const { getEmailLogs } = require("../controllers/emailLogController");
const { protect } = require("../middleware/authMiddleware");

// Route to fetch email logs
router.get("/", protect, getEmailLogs);

module.exports = router;
