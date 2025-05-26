import { DetailResponse } from "./form_responses";
import { FourScaleSurveyResponse } from "./form_responses";

export type ResponseFormat = {
  surveyID: string;
  details_field: DetailResponse;
  survey_responses: FourScaleSurveyResponse;
};