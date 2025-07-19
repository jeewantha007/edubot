require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://edubot:Y9Nv9XUI1EHr16tS@edubot.vfcztb3.mongodb.net/?retryWrites=true&w=majority&appName=edubot';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

const chatRoutes = require('./routes/chat_routes');
app.use('/api', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
