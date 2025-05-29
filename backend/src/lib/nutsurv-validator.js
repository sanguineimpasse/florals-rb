//MMMMM YUMMY SPAGHETTI I LOVE SPAGHETTI!!!!
const NutSurvValidator = (survey) => {
  const enableDebug = false;
  try{
    if(!survey.surveyID && !survey.details_field && !survey.survey_responses){
        if(enableDebug) console.log("not existing: surveyID, detials_field, survey_responses");
      return false;
    }

    if(enableDebug){
      console.log("NutSurvValidate running.")
      console.log(`type of details_field: ${typeof(survey.details_field)}`);
      console.log(`type of survey_responses: ${typeof(survey.survey_responses)}`);
    }

    if(survey.surveyID != "230724"){
        if(enableDebug) console.log("surveyID is not the required id");
      return false;
    }

    //validate the details field
    if(!survey.details_field.q2 && !survey.details_field.q3){
        if(enableDebug) console.log(`details_field[q${x}] does not exist!`);
      return false;
    }

    if(survey.details_field.q2 != "Male" && survey.details_field.q2 != "Female" && survey.details_field.q2 != "Prefer not to say"){
        if(enableDebug) console.log("q2's response is not valid answer (was " + survey.details_field.q2 + ")");
      return false;
    }

    if(!(/^\d+$/.test(survey.details_field.q4)) && survey.details_field.q4 != undefined){
        if(enableDebug) console.log("q4's response is not a number!");
      return false;
    }

    //validate the survey responses
    for(let x = 1; x <= 2; x++){
      for(let y = 1; y <= 10; y++){
        const answer = survey.survey_responses[`p${x}_q${y}`];
        if(!answer){
            if(enableDebug) console.log(`p${x}_q${y} does not exist!`);
          return false;
        } else if(!(answer >= 1 && answer <= 4)){
            if(enableDebug)console.log(`invalid number answer on p${x}_q${y}`);
          return false;
        }
      }
    }

    return true;
  } catch(error){
    return false;
  }
};

module.exports = NutSurvValidator;