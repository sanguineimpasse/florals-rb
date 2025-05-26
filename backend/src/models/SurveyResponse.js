const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  surveyID: {
    type: String,
    required: true,
  },
  details_field: {
    type: Map,
    of: String,
    required: true,
  },
  survey_responses: {
    type: Map,
    of: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('SurveyResponse', responseSchema, 'survey_responses');