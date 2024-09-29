// models/Expense.js

const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true,
        maxlength: 50
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        maxlength: 500
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', ExpenseSchema);
