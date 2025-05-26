const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://vsmischyk:OHKjayE3UwKAriWs@cluster0.kfscn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"; // Замініть на свій MongoDB Atlas URI

const connectDB = async () => {
  try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB connected successfully');
  } catch (err) {
      console.error('Database connection failed:', err);
  }
};

module.exports = connectDB;