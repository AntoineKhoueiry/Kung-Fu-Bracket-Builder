const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');
const playersRoute = require('./routes/players');
const coachesRoute = require('./routes/coaches');
const categoriesRoutes = require('./routes/categories');
const registerPlayerRoute = require('./routes/register-players');
const playersRoutes = require('./routes/players');


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))  
  .catch(err => console.error('❌ MongoDB connection error:', err));

  
  app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    next();
  });
  
  
app.use('/players', playersRoute);
app.use('/coaches', coachesRoute);
app.use('/categories', categoriesRoutes);
app.use('/register-players', registerPlayerRoute);
app.use('/api/players', playersRoutes);




app.post('/register', async (req, res) => {
  console.log("📥 POST /register", req.body);
  try {
    const { uid, email, age, weight, category } = req.body;
    const user = new User({ uid, email, age, weight, category });
    await user.save();
    res.status(201).json({ message: 'User saved to MongoDB' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(3001, '0.0.0.0', () => {
  console.log("🚀 Server running on http://0.0.0.0:3001");
});
