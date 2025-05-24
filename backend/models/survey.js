const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const surveySchema = new Schema({
  survey_id: {
      type: String,
      required: true
  },
  name: {
      type: String,
      required: true
  },
  type: {
      type: String,
      required: true
  },
  title: {
      type: String,
      required: true
  },
  desc: {
      type: String,
      required: true
  },
  color: {
      type: String,
      required: true
  },
  pages: [{
      title: {
          type: String,
          required: true
      },
      questions: [{
          type: String,
          required: true
      }]
  }]
});

const Survey = mongoose.model('Survey', surveySchema, 'surveys');
module.exports = Survey;
