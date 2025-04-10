require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
  });
  
  const mongoose = require('mongoose');
  
  const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URL);
      console.log(`Connected to ${process.env.NODE_ENV} database`);
    } catch (err) {
      console.error('Database connection error:', err);
    }
  };
  
  module.exports = connectDB;
  