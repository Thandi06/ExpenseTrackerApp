// models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensure usernames are unique
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

module.exports = mongoose.model('User', UserSchema);
