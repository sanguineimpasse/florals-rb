const express = require('express');
const router = express.Router();

const NutSurvValidator = require('../lib/nutsurv-validator');
const SurveyResponse = require('../models/SurveyResponse');
const connectToDatabase = require('../lib/mongo');

router.post('/survey/submit', async (req, res) => {
  console.log('[/survey/submit]: doing post operation');

  const valid = NutSurvValidator(req.body);
  if(!valid){
    return res.status(400).json({ message: "Invalid inputs detected." });
  }

  try {
    await connectToDatabase();
    const survey = new SurveyResponse(req.body);
    await survey.validate();
    await survey.save();
    //await SurveyResponse.create({ surveyID: surveyID, details_field: details_field, survey_responses: survey_responses });
    const response = { message: "Success"};
    res.status(201).json({ response });
  } catch (error) {
    console.error('Error submitting response:', JSON.stringify(error));
    res.status(500).json({ message: 'Internal Server Error — Failed to submit response', error: error });
  }
});

if(process.env.NODE_ENV !== 'production'){
  router.post('/test/survey/submit', async (req, res) => {
    const { surveyID, details_field, survey_responses } = req.body;

    const valid = NutSurvValidator(req.body);

    if(!valid){
      return res.status(400).json({ message: "Invalid inputs detected." });
    }
    
    console.log(`\nsubmission for surveyID ${surveyID} \nsubmitter: ${details_field.q1} of year ${details_field.q3}`)
    console.log( 'their responses: ' + JSON.stringify(survey_responses) + '\n');
    const response = { message : 'valid inputs 👍' } //emoji on code???? AHHHHHHH HELLL NAWWWW 😭💀
    res.status(202).json({ response })
  });
}

router.get('/test', (req, res) => {
  const data = {
    message: 'Hello, world!',
    timestamp: new Date(),
    status: 'success'
  };
  res.status(200).json({ data: data });
});

router.get('/dbhealth', async (req,res) =>{
  try{
    await connectToDatabase();
    res.status(200).json({mesage: "database is running"});
  }catch(error){
    res.status(500).json({ message: `database is not responding. (${JSON.stringify(error)})`});
  };
});

router.get('/brew', (req, res) => {
  const date = new Date();
  res.status(418).json({message:"I'm a teapot. I cannot brew coffee.", timestamp: date});
});

module.exports = router;