const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Category = require('../models/Category');

// Middleware: make sure the coach is authenticated
// Assume req.user.coachId contains the coach ID

router.get('/', async (req, res) => {
    try {
      console.log('🔵 Categories route hit');
  
      const { coachId } = req.query;
      
      if (!coachId) {
        return res.status(400).json({ error: "Missing coachId in request" });
      }
      console.log('🟢 Coach ID:', coachId);
  
      // Step 1: Find coach's players
      const players = await Player.find({ coachId });
      console.log('🟡 Found players:', players.length);
  
      if (players.length === 0) {
        return res.json([]); // No players
      }
  
      // Step 2: Group by category
      const categoryCounts = {};
      players.forEach(player => {
        const catId = player.categoryId?.toString();
        if (catId) {
          categoryCounts[catId] = (categoryCounts[catId] || 0) + 1;
        }
      });
      console.log('🟠 Category counts:', categoryCounts);
  
      // Step 3: Find categories
      const categories = await Category.find({
        
        _id: { $in: Object.keys(categoryCounts) }
      });
      console.log('📋 Raw categories:', categories);

      console.log('🔴 Categories found:', categories.length);
  
      // Step 4: Build response
      const response = categories.map(cat => {
        const c = cat.toObject(); // 🔥 Make it a plain JS object
        return {
          categoryId: c._id,
          categoryName: c.name || `${c.ageGroup} / ${c.weightClass}`, // fallback
          ageGroup: c.ageGroup,
          weightClass: c.weightClass,
          gender: c.gender || 'Unknown',
          playerCount: categoryCounts[c._id.toString()] || 0
        };
      });
      
  
      console.log('🧩 Final response:', response);
      res.json(response);
  
    } catch (err) {
      console.error('🔥 Error in /categories:', err);
      res.status(500).json({ error: 'Server error' });
    }
  });


  // GET categories count for a specific coach
router.get('/count', async (req, res) => {
  try {
    console.log('🔵 Categories count route hit');

    const { coachId } = req.query;

    if (!coachId) {
      return res.status(400).json({ error: "Missing coachId in request" });
    }

    console.log('🟢 Coach ID:', coachId);

    // Step 1: Find coach's players
    const players = await Player.find({ coachId });
    console.log('🟡 Found players:', players.length);

    if (players.length === 0) {
      return res.json({ count: 0 }); // No players, no categories
    }

    // Step 2: Group by category
    const categoryIds = new Set();
    players.forEach(player => {
      const catId = player.categoryId?.toString();
      if (catId) {
        categoryIds.add(catId);
      }
    });

    console.log('🟠 Unique category IDs:', [...categoryIds]);

    const count = categoryIds.size;

    res.json({ count });

  } catch (err) {
    console.error('🔥 Error in /categories/count:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

  




module.exports = router;
