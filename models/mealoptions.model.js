const mongoose = require('mongoose');

const mealoptionsSchema = new mongoose.Schema({
    meal: {
        type: String,
        required: true,
        enum: ['Breakfast', 'Lunch', 'Dinner']
    },

    cuisine: {
        type: String,
        required: true,
        enum: ['Indian', 'Chinese', 'Italian','Mexican','American','Japanese','Thai','Mediterate','French']
    },

    nutrients: {
        type: String,
        required: false,
        enum: ['Protein', 'Carbs', 'Fats','Vitamin A','Vitamin C','Vitamin D','Vitamin E','Vitamin K','Calcium','Minerals','Fiber']
    },
    
    improvment: {
        type: String,
        required: false,
        trim: true,
        minlength: 0,
        maxlength: 255
    },

    ingredients:{
        type: string,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 1000
    } 
});

const MealLog = mongoose.model('MealLog', mealLogSchema);
module.exports = MealLog;