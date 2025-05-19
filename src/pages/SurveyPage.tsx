import React from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import FourScaleCard from '../components/four-scale-card';
import TypefluidCards from '../components/typefluid-cards';

import survey_imported from '../data/nutrition_survey.json'

const SurveyPage = () => {
  const params = useParams();
  const [survey, setSurvey] = React.useState(survey_imported);

  const [surveyExists, setSurveyExists] = React.useState(false); //* this should actually be a check to the server whether the survey exists on the db
  React.useEffect(() => {
    if (params.id === '230724') {
      setSurveyExists(true);
    } else {
      setSurveyExists(false);
    }
  }, [params]);

  const [onPreForm, setOnPreForm] = React.useState(false); //pre form means before 'the' (actual) form lmaoo

  return(
    <div className="flex justify-center items-center h-full w-screen overflow-y-auto">
      {!surveyExists ? (
          <div className='flex flex-col h-screen justify-center'>
            <h1 className="text-9xl p-6">{":("}</h1>
            <p className='text-4xl ps-7 font-bold'>Survey not found.</p>
          </div>
        ) : (
          // thin responsive column
          <div className="flex flex-col items-center h-full w-md p-4 gap-5">

            <Card className='w-full'>
              <CardHeader>
                <CardTitle className="text-2xl">{survey.title}</CardTitle>
                <CardDescription>{survey.desc}</CardDescription>
              </CardHeader>
            </Card>
            
            {/* //! main fields && questions */}
            { onPreForm === false ? (
              <>
                <Card className='w-full gap-3'>
                  <CardHeader>
                    <CardTitle className='leading-5'>
                      {survey.details_field.title}
                    </CardTitle>
                  </CardHeader>
                </Card>
                {survey.details_field.fields.map((field, index) => (
                  <TypefluidCards
                    key={index}
                    title={field.title}
                    type={field.type}
                    optional={field.optional}
                    choices={field.choices}
                    limit={field.limit}
                  />
                ))}

                <Button className='w-full'>
                  {"Proceed"}
                </Button>

              </>
            ) : (
              <>
              
              </>
            )}

            {/* page buttons beyond this point */}

          </div>
      )}
    </div>
  )
};

export default SurveyPage;