import React from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './components/ui/card';

import survey_imported from './data/nutrition_survey.json'

const SurveyPage = () => {
  const params = useParams();
  const [surveyExists, setSurveyExists] = React.useState(false); //! this should actually be a check to the server whether the survey exists on the db

  const [survey, setSurvey] = React.useState(survey_imported);

  React.useEffect(() => {
    if (params.id === '230724') {
      setSurveyExists(true);
    } else {
      setSurveyExists(false);
    }
  }, [params]);

  return(
    <div className="flex justify-center items-center h-screen w-screen">
      {!surveyExists ? (
          <div>
            <h1 className="text-9xl p-6">{":("}</h1>
            <p className='text-4xl ps-7 font-bold'>Survey not found.</p>
          </div>
        ) : (
          // thin responsive column
          <div className="flex flex-col items-center h-screen w-lg p-4">

            <Card className='w-full'>
              <CardHeader>
                <CardTitle className="text-2xl">{survey.title}</CardTitle>
                <CardDescription>{survey.desc}</CardDescription>
              </CardHeader>
            </Card>

          </div>
      )}
    </div>
  )
};

export default SurveyPage;