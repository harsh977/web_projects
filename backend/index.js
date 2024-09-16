const express = require('express');
const bodyParser = require('body-parser');
const mainRouter = require('./routes/index.js'); // Fixed path and removed unnecessary import
const cors = require('cors');

const app = express(); // Initialize the Express app
const port = 3000; // Port number for the server

app.use(cors({
  origin: 'http://localhost:5173', // The port your frontend is running on
})); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON bodies

app.use('/api/v1', mainRouter); // Mount mainRouter on /api/v1 path

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

module.exports = app; // Export the Express app
