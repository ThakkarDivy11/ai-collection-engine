require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Payment webhook needs raw body
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());

const { initCron } = require("./services/automationService");
const { initAgentCron } = require("./ai-agent/scheduler");

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://divy:divy123@cluster0.bi91qsg.mongodb.net/aicollection");

mongoose.connection.once("open", () => {
    console.log("MongoDB Connected");
    initCron(); // Start the daily automation cron job
    initAgentCron(); // Start the AI Agent chronological job
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clients", require("./routes/clientRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/invoices", require("./routes/invoiceRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/email-logs", require("./routes/emailLogRoutes"));
const debugRoutes = require('./routes/debugRoutes');
app.use('/api/debug', debugRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});