require("dotenv").config();
const mongoose = require("mongoose");
const Client = require("../models/Client");

const checkClients = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://divy:divy123@cluster0.bi91qsg.mongodb.net/aicollection");
        console.log("DB Connected");

        const clients = await Client.find({}, { name: 1, email: 1, company: 1, status: 1 });
        console.log("Clients in Database:");
        console.table(clients.map(c => ({
            name: c.name,
            email: c.email,
            company: c.company,
            status: c.status
        })));

        process.exit();
    } catch (error) {
        console.error("Error checking clients:", error);
        process.exit(1);
    }
};

checkClients();
