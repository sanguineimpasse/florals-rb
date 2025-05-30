const express = require('express');

if(process.env.NODE_ENV !== 'production'){
  const path = require('path');
  const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const router = express.Router();

//routes here

module.exports = router;