require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const setup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://divy:divy123@cluster0.bi91qsg.mongodb.net/aicollection");
        console.log("DB Connected");

        // 1. Demote admin@gmail.com to admin
        const adminUser = await User.findOne({ email: "admin@gmail.com" });
        if (adminUser) {
            adminUser.role = "admin";
            await adminUser.save();
            console.log("admin@gmail.com is now a regular admin.");
        }

        // 2. Create or Update superadmin@gmail.com
        let superAdmin = await User.findOne({ email: "superadmin@gmail.com" });
        if (!superAdmin) {
            const hashedPassword = await bcrypt.hash("superadmin123", 10);
            superAdmin = await User.create({
                name: "System Super Admin",
                email: "superadmin@gmail.com",
                password: hashedPassword,
                role: "superadmin"
            });
            console.log("Created new superadmin: superadmin@gmail.com / superadmin123");
        } else {
            superAdmin.role = "superadmin";
            await superAdmin.save();
            console.log("superadmin@gmail.com is now a Super Admin.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

setup();
