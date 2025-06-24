const express = require('express');

if(process.env.NODE_ENV !== 'production'){
  const path = require('path');
  const dotenv = require('dotenv').config({ path: path.join(__dirname, '../.env') });
}

const router = express.Router();
const SurveyResponse = require('../models/SurveyResponse');
const connectToDatabase = require('../lib/mongo');

const jwtSecret = new TextEncoder().encode(process.env.JWT_SECRET);

const enableDebug = false;

//helper functions here
async function isTokenValid(token){
  const { jwtVerify } = await import('jose');
  
  try {
    await jwtVerify(token, jwtSecret);
    enableDebug && console.log("token is valid");
    return true;
  } catch (error) {
    enableDebug && console.log("token is invalid \n" + error);
    return false;
  }
}

//routes here
router.get('/get-responses', async (req, res) => {
  enableDebug && console.log("attempting to create responses view for frontend");

  const token = req.cookies.token;
  if (!token){
    enableDebug && console.log("token is invalid");
    return res.status(401).json({ message: "Invalid token" });
  }

  //verify if token is valid
  if(!isTokenValid(token)) {
    enableDebug && console.log("token is invalid");
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await connectToDatabase(160000); 
    // const result = await SurveyResponse.aggregate([]);
    const docs = await SurveyResponse.find().lean();
    const tally = {};

    tally["total_responses"] = docs.length;

    for (const doc of docs) {
      for (const parentKey of ["details_field", "survey_responses"]) {
        
        if (!doc[parentKey]) continue;

        for (const key in doc[parentKey]) {
          //console.log(`for parentkey ${parentKey}: key ${key}`);
          const value = String(doc[parentKey][key]);
          const fullKey = `${parentKey}.${key}`; // e.g. "responses.p1_q3"

          tally[fullKey] = tally[fullKey] || {};
          tally[fullKey][value] = (tally[fullKey][value] || 0) + 1;
        }
      }
    }

    res.status(200).json(tally);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: JSON.stringify(error) });
  }
  
  router.get('/get-nutrition-responses', async (req, res) => {
  enableDebug && console.log("attempting to create nutrition responses view");

  const token = req.cookies.token;
  if (!token) {
    enableDebug && console.log("token is invalid");
    return res.status(401).json({ message: "Invalid token" });
  }

  //verify if token is valid
  if (!(await isTokenValid(token))) {
    enableDebug && console.log("token is invalid");
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    await connectToDatabase(160000);
    const docs = await SurveyResponse.find().lean();
    const nutritionTally = {};

    nutritionTally["total_responses"] = docs.length;

    for (const doc of docs) {
      if (!doc.survey_responses) continue;

      for (const key in doc.survey_responses) {
        if (key.startsWith('p2_')) {
          const value = String(doc.survey_responses[key]);
          const fullKey = `survey_responses.${key}`;

          nutritionTally[fullKey] = nutritionTally[fullKey] || {};
          nutritionTally[fullKey][value] = (nutritionTally[fullKey][value] || 0) + 1;
        }
      }
    }

    res.status(200).json(nutritionTally);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: JSON.stringify(error) });
  }
});


});



module.exports = router;