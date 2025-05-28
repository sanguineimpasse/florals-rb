//MMMMM YUMMY SPAGHETTI I LOVE SPAGHETTI!!!!
const NutSurvValidator = (survey) => {
  try{
    if(!survey.surveyID && !survey.details_field && !survey.survey_responses){
      //console.log("not existing: surveyID, detials_field, survey_responses")
      return false;
    }
    // console.log("NutSurvValidate running.")
    // console.log(`type of details_field: ${typeof(survey.details_field)}`);
    // console.log(`type of survey_responses: ${typeof(survey.survey_responses)}`);

    if(survey.surveyID != "230724"){
      //console.log("surveyID is not the required id")
      return false;
    }

    //validate the details field
    // if(!survey.details_field.q2 && !survey.details_field.q3){
    //   return false;
    // }
    for(let x = 2; x <= 3; x++){
      if(!survey.details_field[`q${x}`]){
        //console.log(`details_field[q${x}] does not exist!`)
        return false;
      }else{
        //console.log(`q${x} = exists`);
      }
    }

    if(survey.details_field.q2 != "Male" && survey.details_field.q2 != "Female" && survey.details_field.q2 != "Prefer not to say"){
      //console.log("q2's response is not valid answer (was " + survey.details_field.q2 + ")");
      return false;
    }

    if(!(/^\d+$/.test(survey.details_field.q4)) && survey.details_field.q4 != undefined){
      //console.log("q4's response is not a number!");
      return false;
    }

    //validate the survey responses
    for(let x = 1; x <= 2; x++){
      for(let y = 1; y <= 10; y++){
        const answer = survey.survey_responses[`p${x}_q${y}`];
        if(!answer){
          //console.log(`p${x}_q${y} does not exist!`)
          return false;
        } else if(!(answer >= 1 && answer <= 4)){
          //console.log(`invalid number answer on p${x}_q${y}`)
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