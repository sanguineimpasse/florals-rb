import React from 'react';
import { useParams } from 'react-router';
import { 
  Card, 
  //CardContent, 
  CardDescription, 
  //CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FourScaleCard from '@/components/four-scale-card';
import TypefluidCards from '@/components/typefluid-cards';

import { Survey } from '@/types/survey_format';
import { DetailResponse } from '@/types/form_responses';
import { FourScaleSurveyResponse } from '@/types/form_responses';
import survey_imported from '@/data/nutrition_survey.json'

const FormSubmittedView = () => {
  return(
    <div className="flex flex-col items-center h-full w-md p-4 gap-5">

      <Card className='w-full'>
        <CardHeader>
          <CardTitle className="text-2xl">{"Response Submitted."}</CardTitle>
          <CardDescription>{"Thank you for participating in the survey! ☺️"}</CardDescription>
        </CardHeader>
      </Card>

    </div>
  )
};

const NotFound = () => {
  return(
    <div className='flex flex-col h-screen justify-center'>
      <h1 className="text-9xl p-6">{":("}</h1>
      <p className='text-4xl ps-7 font-bold'>Survey not found.</p>
    </div>
  )
};

interface MainPageProps {
  survey: Survey;
  setFormIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
}

const MainView = ({survey, setFormIsSubmitted} : MainPageProps) => {
  //* detect if the user will refresh the page when they are filling the fields
  const [isDirty, setIsDirty] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        console.log("unload detected when the form is already dirty");
        const message = 'You have unsaved changes. Are you sure you want to leave?'; //some browsers will ignore this custom message
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
 
  const [onPreForm, setOnPreForm] = React.useState<boolean>(true); //pre form means before the (actual) survey thing lmaoo
  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const [preFormResponses, setPreFormResponses] = React.useState<DetailResponse>({});
  const [surveyResponse, setSurveyResponse] = React.useState<FourScaleSurveyResponse>({});

  const handlePreFormResponse = ( id: string, response: string) => {
    setPreFormResponses(prev => ({...prev, [id]: response }));
  };
  const handlePreFormSubmission = () =>{
    setIsDirty(true);
    setOnPreForm(false);
  };

  const handleSurveyResponse = ( id: string, response: string) => {
    setSurveyResponse(prev => ({...prev, [id]: response }));
  };
  const handleSurveySubmission = () => {
    console.log("Submitting form");
    console.log(preFormResponses);
    console.log(surveyResponse);

    setIsDirty(false);
    setFormIsSubmitted(true);
  };

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage(prev => prev - 1);
  }

  //* DEBUG
  const handlePrintPreForm = () => {
    console.log(preFormResponses);
  };
  const [showP, setShowP] = React.useState(false);
  const handlePrintSurvey = () => {
    //console.log("the value of p1q1 is" + surveyResponse[`p1q1`]);
    setShowP(true);
    console.log(surveyResponse);
  };
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
              choices={field.choices}
              limit={field.limit}
              onInputChange={(val)=> handlePreFormResponse(field.id, val)}
            />
          ))}

          <div className='w-full'>
            <Button className='w-full' onClick={()=>handlePreFormSubmission()}>
              {"Proceed"}
            </Button>
            <p className='text-xs text-center'>{"Note: You can't go back to this page later"}</p>
          </div>
          
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

          {survey.pages[currentPage].questions.map((question) => (
            <FourScaleCard 
              key={question.id} 
              question={question.question}
              value={surveyResponse[question.id] || ""}
              onRadioChange={(val) => handleSurveyResponse(question.id, val)}
            />
          ))}

          <div className="flex flex-row w-full">
            {currentPage > 0 && (
              <Button onClick={()=>handlePrevPage()}>
                {"Previous Page"}
              </Button>
            )}
            <div className="w-full"></div>
            {currentPage < survey.pages.length - 1 && (
              <Button onClick={()=>handleNextPage()}>
                {"Next Page"}
              </Button>
            )}
            {currentPage === survey.pages.length - 1 && (
              <Button onClick={()=>handleSurveySubmission()}>
                {"Submit"}
              </Button>
            )}
          </div>

        </>
      )}
      { //debug div weeeeeeeee
        false && (
          <div className="fixed top-1/2 left-0 ml-4 transform -translate-y-1/2 bg-accent shadow-lg p-4 rounded-lg z-50 w-xs">
            <Button className="m-2" onClick={()=>handlePrintPreForm()}>{"Print PreForm responses here"}</Button>
            <Button className="m-2" onClick={()=>handlePrintSurvey()}>{"Print Survey responses here"}</Button>
            {(showP && <pre>{JSON.stringify(surveyResponse, null, 2)}</pre>)}
          </div>
        )
      }
    </div>
    
  )
};

const SurveyPage = () => {
  const params = useParams();
  const [survey, setSurvey] = React.useState<Survey | null>(null);
  const [formIsSubmitted, setFormIsSubmitted] = React.useState(false);

  React.useEffect(() => {
    if (params.id === '230724') {
      setSurvey(survey_imported);
    }
  }, [params]);

  return(
    <div className="flex justify-center items-center h-full w-screen overflow-y-auto">
      {survey !== null ? (
        !formIsSubmitted ? (
          <MainView survey={survey} setFormIsSubmitted={setFormIsSubmitted} />
        ) : (
          <FormSubmittedView />
        )
      ) : (
        <NotFound />
      )}
    </div>
  )
};

export default SurveyPage;