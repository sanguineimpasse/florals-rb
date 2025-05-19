import React from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FourScaleCard from '@/components/four-scale-card';
import TypefluidCards from '@/components/typefluid-cards';

import { Survey } from '@/types/survey_format';
import survey_imported from '@/data/nutrition_survey.json'

interface MainPageProps {
  survey: Survey
}

const NotFound = () => {
  return(
    <div className='flex flex-col h-screen justify-center'>
      <h1 className="text-9xl p-6">{":("}</h1>
      <p className='text-4xl ps-7 font-bold'>Survey not found.</p>
    </div>
  )
};

const MainView = ({survey} : MainPageProps) => {

  //* detect if the user is refreshing while they are filling the fields
  const [isDirty, setIsDirty] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Standard message for most browsers, some ignore custom messages
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.preventDefault();
        e.returnValue = message; // Gecko, Trident, Chrome 34+
        return message; // Gecko, WebKit, Chrome <34
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [isDirty]);
 
  const [onPreForm, setOnPreForm] = React.useState<boolean>(true); //pre form means before 'the' (actual) form lmaoo
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const [preFormResponses, setPreFormResponses] = React.useState();
  const [formResponses, setFormResponses] = React.useState();

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage(prev => prev - 1);
  }

  return (
    // thin responsive column
    <div className="flex flex-col items-center h-full w-md p-4 gap-5">

      <Card className='w-full'>
        <CardHeader>
          <CardTitle className="text-2xl">{survey.title}</CardTitle>
          <CardDescription>{survey.desc}</CardDescription>
        </CardHeader>
      </Card>
      
      {/* //! main fields && questions */}
      { onPreForm === true ? (
        <>

          <Card className='w-full gap-3'>
            <CardHeader>
              <CardTitle className='leading-5'>
                {survey.details_field.title}
              </CardTitle>
            </CardHeader>
          </Card>

          {survey.details_field.fields.map((field) => (
            <TypefluidCards
              key={field.id}
              title={field.title}
              type={field.type}
              optional={field.optional}
              choices={field.choices}
              limit={field.limit}
            />
          ))}

          <Button className='w-full' onClick={()=>setOnPreForm(false)}>
            {"Proceed"}
          </Button>

        </>
      ) : 
      //* This is after the pre-form (the proceed button is pressed) 
      (
        <>
          <Card className='w-full gap-3'>
            <CardHeader>
              <CardTitle className='leading-5'>
                {survey.pages[currentPage].title}
              </CardTitle>
            </CardHeader>
          </Card>

          {survey.pages[currentPage].questions.map((questions) => (
            <FourScaleCard key={questions.id} question={questions.question}/>
          ))}

          <div className="flex flex-row w-full">
            {currentPage > 0 && (
              <Button className='' onClick={()=>handlePrevPage()}>
                {"Previous Page"}
              </Button>
            )}
            <div className="w-full"></div>
            {currentPage < survey.pages.length - 1 && (
              <Button className='' onClick={()=>handleNextPage()}>
                {"Next Page"}
              </Button>
            )}
          </div>
        </>
      )}

    </div>
  )
};

const SurveyPage = () => {
  const params = useParams();
  const [survey, setSurvey] = React.useState<Survey | null>(null);

  React.useEffect(() => {
    if (params.id === '230724') {
      setSurvey(survey_imported);
    }
  }, [params]);

  return(
    <div className="flex justify-center items-center h-full w-screen overflow-y-auto">
      {survey !== null ? (
        <MainView survey={survey} />
      ) : (
        <NotFound/>
      )}
    </div>
  )
};

export default SurveyPage;