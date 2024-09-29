// routes/expenses.js

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   POST /api/expenses
// @desc    Add new expense
// @access  Private
router.post('/', auth, async (req, res) => {
    const { date, category, amount, description } = req.body;

    // Basic validation
    if (!date || !category || !amount) {
        return res.status(400).json({ message: 'Please enter all required fields.' });
    }

    try {
        const newExpense = new Expense({
            date,
            category,
            amount,
            description,
            user: req.user.id // Accessing req.user set by auth middleware
        });

        const expense = await newExpense.save();
        res.json(expense);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.');
    }
});

// @route   GET /api/expenses
// @desc    Get all expenses for user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.');
    }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found.' });
        }

        // Ensure user owns the expense
        if (expense.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized.' });
        }

        await expense.remove();
        res.json({ message: 'Expense removed.' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Expense not found.' });
        }
        res.status(500).send('Server error.');
    }
});

module.exports = router;
