require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");

const User = require('./models/user.model');
const MealLog = require('./models/meallog.model');
const FunFact = require('./models/funfact.model');
const WellnessSession = require('./models/wellness.model');
const Media = require('./models/media.model');

port = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// create a new user
app.post('/api/createUser', async (req, res) => {
    try {
        // Validate and create a new user instance with the request data
        if (req.body.lastName === "") {
            req.body.lastName = null;
        }
        const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            profileCompleted: false,            
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

// get user by email
app.get('/api/getUser', async (req, res) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email:
            req.query.email });

        // If the user doesn't exist
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the user
        res.status(200).json(user);
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

        // Update only fields provided in the request data
        if (req.body.firstName) user.firstName = req.body.firstName;
        if (req.body.lastName) user.lastName = req.body.lastName;
        if (req.body.phoneNumber) user.phoneNumber = req.body.phoneNumber;
        if (req.body.profileCompleted) user.profileCompleted = req.body.profileCompleted;
        if (req.body.dob) user.dob = req.body.dob; 
        if (req.body.bloodGroup) user.bloodGroup = req.body.bloodGroup;
        if (req.body.height) user.height = req.body.height;
        if (req.body.weight) user.weight = req.body.weight;
        if (req.body.healthIssuesOrAllergies) user.healthIssuesOrAllergies = req.body.healthIssuesOrAllergies;
        if (req.body.priorInjuries) user.priorInjuries = req.body.priorInjuries;
        if (req.body.gender) user.gender = req.body.gender;

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

// get fun facts
app.get('/api/getFunFact', async (req, res) => {
    try {
        // Use MongoDB's aggregation to get a random sample of 2 fun facts
        const funFact = await FunFact.aggregate([{ $sample: { size: 2 } }]);

        // Respond with the fun facts
        res.status(200).json(funFact);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// Route to add a new fitness fun fact (POST request with JSON body)
app.post('/api/addFunFact', async (req, res) => {
    try {
        const { fact } = req.body;

        if (!fact) {
            return res.status(400).json({ error: 'A fun fact is required' });
        }

        const newFunFact = new FunFact({ fact });
        await newFunFact.save();

        res.status(200).json({ message: 'Fun fact saved successfully', data: newFunFact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate meal plan
async function generateMealPlan(userPreferences) {
    const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful meal planning assistant." },
                { role: "user", content: `Create a meal plan based on the following preferences: ${userPreferences}` }
            ]
        },
        {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                'Content-Type': 'application/json'
            }
        }
    );
    return response.data.choices[0].message.content;
}
app.post('/api/gerateMealPlane', async (req, res) => {
    try {
        // Extract user preferences from the request body
        const { userPreferences } = req.body;

        // Call the function to generate the meal plan
        //const mealPlan = await generateMealPlan(userPreferences);

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

// GET meal log by email ID
app.get('/api/getMealLog', async (req, res) => {
    try {
        const { emailID } = req.query;

        // Check if emailID is provided
        if (!emailID) {
            return res.status(400).json({ error: "Email ID is required" });
        }

        // Find meal logs by email ID
        const mealLogs = await MealLog.find({ emailID: emailID });

        // order by date in descending order, then order as dinner, lunch, breakfast
        mealLogs.sort((a, b) => {
            // First, compare dates in descending order
            const dateComparison = new Date(b.date) - new Date(a.date);
            if (dateComparison !== 0) return dateComparison;
        
            // If dates are the same, order by meal type
            const mealOrder = { dinner: 1, lunch: 2, breakfast: 3 };
            return (mealOrder[a.meal] || 4) - (mealOrder[b.meal] || 4);
        });

        // Respond with the meal logs
        if (mealLogs.length > 0) {
            res.status(200).json(mealLogs);
        } else {
            res.status(404).json({ message: "No meal logs found for this email ID" });
        }
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// post meal log
app.post('/api/addMealLog', async (req, res) => {
    try {
        const { meal, calories, date, emailID } = req.body;

        // Validate required fields
        if (!meal || !calories || !date || !emailID) {
            return res.status(400).json({ error: "All fields are required: meal, calories, date, emailID" });
        }

        // Create a new MealLog document
        const newMealLog = new MealLog({
            meal,
            calories,
            date: new Date(date), // Ensure date is in the correct format
            emailID
        });

        // Save to database
        await newMealLog.save();

        res.status(201).json({ message: "Meal log created successfully", data: newMealLog });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete meal log by ID
app.delete('/api/deleteMealLog', async (req, res) => {
    try {
        // get mealLogID from request body
        const { mealLogID } = req.body

        // Find the meal log by ID and delete it
        const deletedMealLog = await MealLog.findByIdAndDelete(mealLogID);

        // If the meal log doesn't exist
        if (!deletedMealLog) {
            return res.status(404).json({ error: 'Meal log not found' });
        }

        // Respond with the deleted meal log
        res.status(200).json(deletedMealLog);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// get media by wellness session type
app.get('/api/getMediaByWellnessType', async (req, res) => {
    try {
        // Find the media by wellness session type
        const media = await Media.find({ sessionType: req.query.sessionType });

        // If the media doesn't exist
        if (!media) {
            return res.status(404).json({ error: 'Media not found' });
        }

        // Respond with the media
        res.status(200).json(media);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// get all media
app.get('/api/getMedia', async (req, res) => {
    try {
        // Get all media from the database
        const media = await Media.find();

        // Respond with the media
        res.status(200).json(media);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// post media
app.post('/api/addMedia', async (req, res) => {
    try {
        const { title, sessionType, mediaType, url } = req.body;

        // Validate required fields
        if (!title || !sessionType || !mediaType || !url) {
            return res.status(400).json({ error: "All fields are required: title, sessionType, mediaType, url" });
        }

        // check if title already exists
        const existingMedia = await Media.findOne({ title });

        if (existingMedia) {
            return res.status(400).json({ error: "Media with this title already exists" });
        }

        // Create a new Media document
        const newMedia = new Media({
            title,
            sessionType,
            mediaType,
            url
        });

        // Save to database
        await newMedia.save();

        res.status(201).json({ message: "Media created successfully", data: newMedia });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete media by title
app.delete('/api/deleteMedia', async (req, res) => {
    try {
        // Find the media by title and delete it
        const deletedMedia = await Media.findOneAndDelete({ title: req.body.title });

        // If the media doesn't exist
        if (!deletedMedia) {
            return res.status(404).json({ error: 'Media not found' });
        }

        // Respond with the deleted media
        res.status(200).json(deletedMedia);
    } catch (error) {
        // Handle and respond to any errors
        res.status(500).json({ error: error.message });
    }
});

// post wellness session
app.post('/api/addWellnessSession', async (req, res) => {
    try {
        const { sessionType, duration, sessionDate, email } = req.body;

        // Validate required fields
        if (!sessionType || !duration || !sessionDate || !email) {
            return res.status(400).json({ error: "All fields are required: sessionType, duration, sessionDate, email" });
        }

        // Check if email belongs to an existing user
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

        // Create a new WellnessSession document
        const newWellnessSession = new WellnessSession({
            sessionType,
            duration,
            sessionDate,
            email
        });

        // Save to database
        await newWellnessSession.save();

        res.status(201).json({ message: "Wellness session created successfully", data: newWellnessSession });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get wellness session by email ID
app.get('/api/getWellnessSession', async (req, res) => {
    try {
        const { email } = req.query;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Check if email belongs to an existing user
        const existingUser = await User.findOne({ email: email });

        if (!existingUser) {
            return res.status(404).json({ error: "User with this email does not exist" });
        }

        // Find wellness sessions by email ID
        const wellnessSessions = await WellnessSession.find({ email: email });

        // Respond with the wellness sessions
        if (wellnessSessions.length > 0) {
            res.status(200).json(wellnessSessions);
        } else {
            res.status(404).json({ message: "No wellness sessions found for this email" });
        }
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