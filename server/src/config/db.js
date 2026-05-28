const mongoose = require('mongoose');

async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) return false;

  try {
    await mongoose.connect(mongoUri);
    return true;
  } catch (error) {
    console.warn('MongoDB connection failed. Falling back to in-memory store.');
    return false;
  }
}

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectDatabase, isMongoConnected };
