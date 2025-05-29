const express = require('express');
const path = require('path');
const cors = require('cors');

if(process.env.NODE_ENV !== 'production'){
  const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const app = express();
const routes = require('./routes/routes');
const adminRoutes = require('./routes/auth.routes');

if(process.env.NODE_ENV !== 'production'){
  app.use(cors());
}
// app.use(cors({ origin: '*' }));
//* note: should probably restrict origins when deploying to prod

app.use(express.json());

//Api routes
app.use('/api', routes);
app.use('/api/admin', adminRoutes);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// Handle requests by serving index.html for all routes
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist', 'index.html'));
});

// Start the server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;