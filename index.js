require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

// Import models
const User = require('./models/user.model');
const MealLog = require('./models/meallog.model');
const WellnessEntry = require('./models/wellnessEntry.model'); // New model for wellness entries

const port = process.env.PORT || 4000;
const app = express();

app.use(express.json());

// Root route for testing
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Create a new user
app.post('/api/createUser', async (req, res) => {
    try {
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            height: req.body.height,
            weight: req.body.weight,
            age: req.body.age,
            gender: req.body.gender
        });

        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get all users
app.get('/api/getUsers', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update user by email
app.put('/api/updateUser', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.height = req.body.height;
        user.weight = req.body.weight;
        user.age = req.body.age;
        user.gender = req.body.gender;

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete user by email
app.delete('/api/deleteUser', async (req, res) => {
    try {
        const deletedUser = await User.findOneAndDelete({ email: req.body.email });
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// New GET request to fetch session history for a specific user
app.get('/api/session/history/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sessions = await WellnessEntry.find({ user: userId });
        res.status(200).json(sessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch session history' });
    }
});

// New POST request to create a wellness session entry
app.post('/api/session/create', async (req, res) => {
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
            date: Date.now() // Track when the entry was created
        });

        const savedEntry = await newEntry.save();
        res.status(201).json({ message: 'Wellness entry created successfully', entry: savedEntry });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create wellness entry' });
    }
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log('Server is running on port', port);
        });
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });
