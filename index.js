require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const User = require('./models/user.model');
const MealLog = require('./models/meallog.model');
const FunFact = require('./models/funfact.model');

const port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Get random fun facts
app.get('/api/getFunFact', async (req, res) => {
    try {
        // Use MongoDB's aggregation to get a random sample of 2 fun facts
        const funFacts = await FunFact.aggregate([{ $sample: { size: 2 } }]);
        res.status(200).json(funFacts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch fun facts' });
    }
});

// Route to add a new fun fact (optional for seeding data)
app.post('/api/addFunFact', async (req, res) => {
    try {
        const { fact } = req.body;
        if (!fact) {
            return res.status(400).json({ error: 'A fun fact is required' });
        }
        const newFunFact = new FunFact({ fact });
        await newFunFact.save();
        res.status(201).json({ message: 'Fun fact saved successfully', data: newFunFact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Other routes (e.g., user management, meal logs) can be added here

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB', err);
    });
