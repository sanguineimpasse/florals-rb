const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SurveyResponseSchema = new Schema({
  details_field:{
    
  },
  survey_responses:{

  }
});

const SurveyResponse = mongoose.model('SurveyResponse', surveySchema, 'surveys');
module.exports = SurveyResponse;