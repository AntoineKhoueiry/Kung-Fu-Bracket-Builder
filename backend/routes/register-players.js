const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Category = require('../models/Category');
const { ObjectId } = require('mongodb');


// Helper function to find correct age group
function findAgeGroup(age) {
  if (age >= 4 && age <= 5) return "4-5 years";
  if (age >= 6 && age <= 7) return "6-7 years";
  if (age >= 8 && age <= 9) return "8-9 years";
  if (age >= 10 && age <= 11) return "10-11 years";
  if (age >= 12 && age <= 13) return "12-13 years";
  if (age >= 14 && age <= 15) return "14-15 years";
  if (age >= 16 && age <= 17) return "16-17 years";
  if (age >= 18 && age <= 35) return "18-35 years";
  return null;
}

// Helper function to find correct weight class
function findWeightClass(weight) {
  if (weight >= 20 && weight < 25) return "20-25kg";
  if (weight >= 25 && weight < 30) return "25-30kg";
  if (weight >= 30 && weight < 35) return "30-35kg";
  if (weight >= 35 && weight < 40) return "35-40kg";
  if (weight >= 40 && weight < 45) return "40-45kg";
  if (weight >= 45 && weight < 50) return "45-50kg";
  if (weight >= 50 && weight < 55) return "50-55kg";
  if (weight >= 55 && weight < 60) return "55-60kg";
  if (weight >= 60 && weight < 65) return "60-65kg";
  if (weight >= 65 && weight < 70) return "65-70kg";
  if (weight >= 70 && weight < 75) return "70-75kg";
  if (weight >= 75 && weight < 80) return "75-80kg";
  if (weight >= 80 && weight < 85) return "80-85kg";
  if (weight >= 85 && weight < 90) return "85-90kg";
  if (weight >= 90) return "90kg+";
  return null;
}


// 🛠 POST /players route
router.post('/', async (req, res) => {

  
  try {


    const { coachId, competitionId: competitionIdString, fullName, age, weight, gender, club } = req.body;

    const ageGroup = findAgeGroup(age);
    const weightClass = findWeightClass(weight);
    

    console.log("Trying to find category for:", { 
      ageGroup, 
      weightClass, 
      gender,
    });

    // Show all categories that match only the ageGroup
    const categoriesByAgeGroup = await Category.find({
    ageGroup: ageGroup,
    weightClass: weightClass,
    gender: gender
    });
    
    console.log("find function result:", categoriesByAgeGroup);

    const categoriesByAge = await Category.findOne({
      ageGroup: ageGroup,
      weightClass: weightClass,
      gender: gender
      });

    console.log("findOne function result:", categoriesByAge);
  
    

    if (!ageGroup || !weightClass) {
      return res.status(400).json({ error: 'Invalid age or weight for category detection.' });
    }

    // Find the correct category document
    const category = await Category.findOne({
      ageGroup: ageGroup,
      weightClass: weightClass,
      gender: gender,
    });
    


    

    if (!category) {
      return res.status(400).json({ error: 'Category not found.' });
    }

    // Create the player
    const player = new Player({
      coachId: new ObjectId(coachId),
      competitionId: new ObjectId(competitionIdString),
      fullName,
      age,
      weight,
      gender,
      club,
      categoryId: category._id,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await player.save();

    res.status(201).json({ message: 'Player created successfully', playerId: player._id });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

module.exports = router;
