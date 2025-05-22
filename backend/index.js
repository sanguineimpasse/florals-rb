const dotenv = require('dotenv').config({ path: '.env.local' });
const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 4000;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));


//API endpoints
app.get('/api/test', (req, res) => {
  res.json({ message: `Your API key is ${process.env.API_KEY}` });
})

app.get('/api/data', (req, res) => {
    const data = {
        message: 'Hello, world!',
        timestamp: new Date(),
        status: 'success'
    };
    res.json(data); // Send JSON response
});


// Handle requests by serving index.html for all routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});