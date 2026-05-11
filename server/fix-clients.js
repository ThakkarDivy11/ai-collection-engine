const mongoose = require('mongoose');
require('dotenv').config();
const Client = require('./models/Client');
const User = require('./models/User');

async function fixOwnership() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const mainAdmin = await User.findOne({ email: 'admin@gmail.com' });
        
        if (mainAdmin) {
            const result = await Client.updateMany(
                { createdBy: { $exists: false } },
                { $set: { createdBy: mainAdmin._id } }
            );
            console.log(`Successfully updated ${result.modifiedCount} clients to Main Admin.`);
        } else {
            console.error("Main Admin (admin@gmail.com) not found!");
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        mongoose.connection.close();
    }
}

fixOwnership();
