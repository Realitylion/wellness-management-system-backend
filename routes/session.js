// routes/session.js
const express = require('express');
const router = express.Router();
const WellnessEntry = require('../models/wellnessEntry.model'); // Import the WellnessEntry model

// GET request to fetch session history for a user
router.get('/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sessions = await WellnessEntry.find({ user: userId });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session history' });
    }
});

// POST request to create a new wellness session entry
router.post('/create', async (req, res) => {
    try {
        const { firstName, lastName, email, height, weight, age, gender } = req.body;
        const newEntry = new WellnessEntry({
            firstName,
            lastName,
            email,
            height,
            weight,
            age,
            gender,
            date: Date.now() // Adding a date field to track when the entry was created
        });

        await newEntry.save();
        res.status(201).json({ message: 'Wellness entry created successfully', entry: newEntry });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create wellness entry' });
    }
});

module.exports = router;
