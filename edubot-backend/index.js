require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const chatRoutes = require('./routes/chat_routes');
app.use('/api', chatRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
