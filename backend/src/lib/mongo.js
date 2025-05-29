const mongoose = require('mongoose');
const path = require('path');
if(process.env.NODE_ENV !== 'production'){
  const dotenv = require('dotenv').config({ path: path.join(__dirname, '../../.env') });
}

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      connectTimeoutMS: 10000,
    });

    isConnected = true;
    //console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
}

module.exports = connectToDatabase;