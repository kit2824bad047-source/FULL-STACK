const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminData = {
            name: 'System Admin',
            email: 'admin@campus.com',
            password: 'password123',
            role: 'admin'
        };

        const hashedPassword = await bcrypt.hash(adminData.password, 10);
        await Admin.findOneAndUpdate(
            { email: adminData.email },
            { ...adminData, password: hashedPassword },
            { upsert: true, new: true }
        );

        console.log('Admin user ready!');
        console.log('Email: admin@campus.com');
        console.log('Password: password123');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
