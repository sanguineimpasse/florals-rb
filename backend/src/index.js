const dotenv = require('dotenv').config({ path: '.env.local' });
const express = require('express');
const path = require('path');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const routes = require('./routes/routes');
const port = process.env.PORT || 4000;

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.use('/api', routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});