console.log(require('fs').readFileSync('.env', 'utf8'));
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const routes = require('./routes/routes');
const port = process.env.PORT || 4000;

app.use(cors());
//restrict the origin when on prod
// app.use(cors({
//   origin: 'https://florals-rb.vercel.app/',
//   credentials: true
// }));

app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/api', routes);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Handle requests by serving index.html for all routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});