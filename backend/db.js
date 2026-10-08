require('dotenv').config();
const mongoose = require('mongoose');

let mongoUri = process.env.MONGO_URI || 'mongodb+srv://agroxai:Kmit123%24@agroxai.veuwuha.mongodb.net/cropdb?retryWrites=true&w=majority';

// Check if MONGO_URI has unencoded special characters in the password
if (mongoUri && (mongoUri.includes('mongodb+srv://') || mongoUri.includes('mongodb://'))) {
    try {
        const matches = mongoUri.match(/^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)(@.+)$/);
        if (matches) {
            const prefix = matches[1];
            const username = matches[2];
            const password = matches[3];
            const suffix = matches[4];
            
            // Encode the password if it's not already encoded
            if (password.includes('$') && !password.includes('%24')) {
                const encodedPassword = encodeURIComponent(password);
                mongoUri = `${prefix}${username}:${encodedPassword}${suffix}`;
                console.log('🔒 Encoded password in MONGO_URI');
            }
        }
    } catch (err) {
        console.error('Error auto-encoding password in MONGO_URI:', err.message);
    }
}

mongoose.connect(mongoUri)
    .then(() => {
        console.log('DB connected successfully');
        seedDefaultUser();
    })
    .catch(err => {
        console.error('DB connection failed:', err.message);
    });

// Add a ping helper to verify actual database responsiveness
mongoose.ping = async () => {
    if (mongoose.connection.readyState !== 1) return false;
    try {
        await mongoose.connection.db.admin().ping();
        return true;
    } catch (err) {
        return false;
    }
};

async function seedDefaultUser() {
    try {
        const User = require('./models/User');
        const bcrypt = require('bcryptjs');
        
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.log('🌱 No users found in database. Seeding a default user...');
            const hashedPassword = await bcrypt.hash('Kmit123!', 10);
            const defaultUser = new User({
                username: 'admin',
                password: hashedPassword
            });
            await defaultUser.save();
            console.log('✅ Default user "admin" with password "Kmit123!" seeded successfully!');
        } else {
            console.log(`ℹ️ Database already has ${userCount} users.`);
        }
    } catch (err) {
        console.error('❌ Failed to seed default user:', err.message);
    }
}

module.exports = mongoose;
