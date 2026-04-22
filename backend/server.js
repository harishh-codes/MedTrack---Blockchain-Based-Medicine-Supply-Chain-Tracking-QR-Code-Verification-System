const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/medicine-supply-chain', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.send('Medicine Supply Chain Tracking API');
});

// Import Routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicine');

app.use('/api/auth', authRoutes);
app.use('/api/medicine', medicineRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
