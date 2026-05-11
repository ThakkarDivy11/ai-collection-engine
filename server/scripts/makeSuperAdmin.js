require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const email = process.argv[2];

if (!email) {
    console.log("Please provide an email: node scripts/makeSuperAdmin.js user@example.com");
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://divy:divy123@cluster0.bi91qsg.mongodb.net/aicollection")
    .then(async () => {
        console.log("Connected to DB");
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("User not found");
            process.exit(1);
        }
        user.role = "superadmin";
        await user.save();
        console.log(`User ${email} is now a Super Admin!`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
