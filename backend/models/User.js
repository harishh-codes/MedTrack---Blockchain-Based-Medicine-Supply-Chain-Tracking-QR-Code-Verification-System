const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['Manufacturer', 'Distributor', 'Pharmacy', 'Admin'], 
    required: true 
  },
  walletAddress: { type: String, required: true },
  details: {
    address: String,
    contact: String,
    licenseNumber: String
  }
});

module.exports = mongoose.model('User', userSchema);
