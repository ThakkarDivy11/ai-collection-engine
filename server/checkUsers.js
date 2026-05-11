require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const checkUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://divy:divy123@cluster0.bi91qsg.mongodb.net/aicollection");
        console.log("DB Connected");

        const users = await User.find({}, { name: 1, email: 1, role: 1 });
        console.log("Users in Database:");
        console.table(users.map(u => ({
            name: u.name,
            email: u.email,
            role: u.role
        })));

        process.exit();
    } catch (error) {
        console.error("Error checking users:", error);
        process.exit(1);
    }
};

checkUsers();
