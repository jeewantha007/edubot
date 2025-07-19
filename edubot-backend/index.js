require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(express.json());

const chatRoutes = require('./routes/chat_routes');
app.use('/api', chatRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
