const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveyResponseSchema = new Schema({
  surveyID:{
    type: String
  },
  details_field:{
    
  },
  survey_responses:{

  },
  timestamp: {
    type: Date
  }
});

const SurveyResponse = mongoose.model('SurveyResponse', surveySchema, 'surveys');
module.exports = SurveyResponse;