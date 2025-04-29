const express = require('express');
const router = express.Router();
const Coach = require('../models/Coach');

router.post('/', async (req, res) => {
  console.log("Incoming POST /coaches", req.body);
  try {
    const { uid, email, firstName, lastName } = req.body;

    const coach = new Coach({
      uid,
      email,
      firstName,
      lastName,
    });

    await coach.save();
    res.status(201).json({ coachId: coach._id });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Failed to create coach' });
  }
});



// ADD THIS inside routes/coaches.js

router.get('/:uid', async (req, res) => {
  try {
    const coach = await Coach.findOne({ uid: req.params.uid });

    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    res.json(coach);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch coach' });
  }
});


module.exports = router;
