const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Category = require('../models/Category');

// GET all players for a specific coach
router.get('/', async (req, res) => {
  console.log("📩 Incoming request to /players:", req.query);

  const { coachId } = req.query;

  if (!coachId) {
    return res.status(400).json({ error: "Missing coachId in request" });
  }

  try {
    const players = await Player.find({ coachId: coachId }).populate('categoryId');
    res.json({ players });
  } catch (error) {
    console.error('❌ Error in /players route:', error); 
    res.status(500).json({ error: 'Internal server error' });    
  }
});


// GET player count for a specific coach
router.get('/count', async (req, res) => {
  const { coachId } = req.query;

  if (!coachId) {
    return res.status(400).json({ error: "Missing coachId in request" });
  }

  try {
    const playerCount = await Player.countDocuments({ coachId: coachId });
    res.json({ count: playerCount });
  } catch (error) {
    console.error('❌ Error in /players/count route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







// Get all players for a specific category

const { ObjectId } = require('mongodb');

router.get('/category/:categoryId', async (req, res) => {
  try {
    const { categoryId } = req.params;
    console.log("🚀 Incoming request with categoryId:", categoryId);

    const objectId = new ObjectId(categoryId);
    console.log("🚀 Converted categoryId to ObjectId:", objectId);

    const players = await Player.find({ categoryId: new ObjectId(categoryId) });
    console.log("🚀 Players found:", players);

    res.json({ players });
  } catch (error) {
    console.error('🚨 Error fetching players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});








module.exports = router;
