require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const User = require('./models/user.model');
const MealLog = require('./models/meallog.model');

port = process.env.PORT || 4000;

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// create a new user
app.post('/api/createUser', async (req, res) => {
    try {
        // Validate and create a new user instance with the request data
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            height: req.body.height,
            weight: req.body.weight,
            age: req.body.age,
            gender: req.body.gender
        });

        // Save the user to the database
        const savedUser = await user.save();

        // Respond with the newly created user
        res.status(201).json(savedUser);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// get all users
app.get('/api/getUsers', async (req, res) => {
    try {
        // Get all users from the database
        const users = await User.find();

        // Respond with the users
        res.status(200).json(users);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

//Genrate meal plane
const mealRecipes = [
    `Grilled Chicken Salad:
    Ingredients: 1 grilled chicken breast (sliced), 2 cups mixed greens, 1/2 avocado (sliced), 1/4 cup cherry tomatoes (halved), 2 tbsp balsamic vinaigrette
    Steps: Grill the chicken breast until fully cooked, then slice it. Arrange mixed greens on a plate and top with avocado slices and cherry tomatoes. Place the sliced chicken on top and drizzle with balsamic vinaigrette.
    Timing: 20 minutes
    Calories: 350 kcal`,

    `Quinoa Bowl with Roasted Vegetables:
    Ingredients: 1 cup cooked quinoa, 1/2 cup roasted vegetables (bell peppers, zucchini, carrots), 1/4 cup chickpeas, 1 tbsp tahini, Salt and pepper to taste
    Steps: Prepare quinoa according to package instructions. Roast the vegetables with a drizzle of olive oil, salt, and pepper at 400°F (200°C) for 20 minutes. Place the quinoa in a bowl, add the roasted vegetables and chickpeas, and drizzle with tahini.
    Timing: 25 minutes
    Calories: 400 kcal`,

    `Vegetable Stir-Fry with Tofu:
    Ingredients: 1 cup firm tofu (cubed), 1 cup mixed vegetables (broccoli, bell peppers, carrots), 1 tbsp soy sauce, 1 tbsp olive oil, 1/2 cup cooked brown rice
    Steps: Heat olive oil in a pan and add the tofu cubes. Stir-fry until golden brown. Add mixed vegetables and cook until tender-crisp. Pour soy sauce over the stir-fry and serve over cooked brown rice.
    Timing: 15 minutes
    Calories: 350 kcal`,

    `Greek Yogurt with Berries and Almonds:
    Ingredients: 1 cup Greek yogurt, 1/2 cup mixed berries (strawberries, blueberries, raspberries), 1 tsp honey, 2 tbsp almonds (chopped)
    Steps: Spoon Greek yogurt into a bowl. Top with berries, honey, and chopped almonds.
    Timing: 5 minutes
    Calories: 200 kcal`,

    `Baked Salmon with Asparagus:
    Ingredients: 1 salmon fillet, 1 cup asparagus spears, 1 tbsp olive oil, Salt and pepper to taste, 1 lemon slice
    Steps: Preheat oven to 400°F (200°C). Place salmon and asparagus on a baking sheet. Drizzle with olive oil, and season with salt and pepper. Bake for 15 minutes, or until the salmon flakes easily with a fork. Garnish with a lemon slice.
    Timing: 20 minutes
    Calories: 300 kcal`,

    `Vegetarian Chili with Beans and Quinoa:
    Ingredients: 1 cup kidney beans (cooked), 1 cup black beans (cooked), 1/2 cup quinoa (cooked), 1 cup diced tomatoes, 1 tbsp chili powder, 1 tsp cumin, Salt and pepper to taste
    Steps: In a pot, combine beans, quinoa, and diced tomatoes. Add chili powder, cumin, salt, and pepper, then simmer for 10 minutes. Serve warm, garnished with fresh herbs if desired.
    Timing: 20 minutes
    Calories: 400 kcal`,

    `Egg White Omelette with Spinach and Feta:
    Ingredients: 4 egg whites, 1/2 cup fresh spinach, 2 tbsp feta cheese (crumbled), Salt and pepper to taste, 1 tsp olive oil
    Steps: In a pan, heat olive oil over medium heat. Add spinach and cook until wilted. Pour egg whites over the spinach, season with salt and pepper, and sprinkle with feta. Cook until the eggs are set, then fold the omelette in half and serve.
    Timing: 10 minutes
    Calories: 150 kcal`,
];

function generateRandomMealPlan() {
    // Select a random meal plan from the list of recipes
    const randomIndex = Math.floor(Math.random() * mealRecipes.length);
    return mealRecipes[randomIndex];
}

app.post('/api/generateMealPlan', (req, res) => {
    try {
        // Generate a random meal plan
        const mealPlan = generateRandomMealPlan();

        // Send the meal plan as the response
        res.json({
            message: 'Meal plan generated successfully',
            mealPlan: mealPlan
        });
    } catch (error) {
        // Handle any errors that occur
        console.error('Error generating meal plan:', error);
        res.status(500).json({
            message: 'An error occurred while generating the meal plan',
            error: error.message
        });
    }
});


// update user by email
app.put('/api/updateUser', async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email: req.body.email });

        // If the user doesn't exist
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update the user with the request data
        try {
            user.firstName = req.body.firstName;
            user.lastName = req.body.lastName;
            user.height = req.body.height;
            user.weight = req.body.weight;
            user.age = req.body.age;
            user.gender = req.body.gender;
        } catch (error) {
            return res.status(400).json({ error: 'Invalid request data' });
        }

        // Save the updated user to the database
        const updatedUser = await user.save();

        // Respond with the updated user
        res.status(200).json(updatedUser);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// delete user by email
app.delete('/api/deleteUser', async (req, res) => {
    try {
        // Find the user by email and delete it
        const deletedUser = await User.findOneAndDelete({ email: req.body.email });
        
        // If the user doesn't exist
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the deleted user
        res.status(200).json(deletedUser);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
    console.log('Server is running on port', port);
});
})
.catch((err) => {
    console.log('Error connecting to MongoDB', err);
});