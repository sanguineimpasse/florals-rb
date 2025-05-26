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
import { ResponseFormat } from '@/types/response_format';
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

const NotFoundView = () => {
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
  const topPageRef = React.useRef<HTMLDivElement>(null);

  //* detect if the user will refresh the page when they are filling the fields
  const [isDirty, setIsDirty] = React.useState<boolean>(false);
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        console.log("unload detected when the form is already dirty");
        const message = 'You have unsaved changes. Are you sure you want to leave?'; //some browsers will ignore the custom message
        e.preventDefault(); // Gecko, Trident, Chrome 34+
        e.returnValue = message; // Gecko, WebKit, Chrome <34
        return message; 
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };

  }, [isDirty]);

  const [onPreForm, setOnPreForm] = React.useState<boolean>(true); //pre form means before the (actual) survey thing lmaoo
  //const [submissionError, setSubmissionError] = React.useState<boolean>(false);

  const [currentPage, setCurrentPage] = React.useState<number>(0);

  const [preFormResponses, setPreFormResponses] = React.useState<DetailResponse>({});
  const [surveyResponses, setSurveyResponses] = React.useState<FourScaleSurveyResponse>({});

  const [preFormErrors, setPreFormErrors] = React.useState<DetailResponse>({});
  const [surveyResponseErrors, setSurveyResponseErrors] = React.useState<FourScaleSurveyResponse>({});
 
  const handlePreFormResponse = ( id: string, response: string) => {
    if(!isDirty){
      setIsDirty(true);
    }
    setPreFormResponses(prev => ({...prev, [id]: response }));
  };
  const handlePreFormErrors = ( id: string, response: string) => {
    setPreFormErrors(prev => ({...prev, [id]: response }));
  };
  const handlePreFormSubmission = () =>{
    //console.log(preFormResponses);
    //* validation
    //* run through every field and check if it's optional, if not, then check if it has an answer
    let valid = true; 
    for (let x = 0; x < survey.details_field.fields.length; x++) {
      const field = survey.details_field.fields[x];
      const response = preFormResponses[`q${x + 1}`];

      if (field.optional !== true && !response) {
        handlePreFormErrors(`q${x + 1}`, 'This field is required.');
        valid = false;
      } else if (field.type === "number" && !(/^\d+$/.test(response)) && response != undefined) {
        handlePreFormErrors(`q${x + 1}`, 'This field only accepts numbers.');
        valid = false;
      } else {
        //remove the error if its already fixed
        handlePreFormErrors(`q${x + 1}`, '');
      }
    }

    if(valid){
      if(!isDirty){
        setIsDirty(true);
      }
      setOnPreForm(false);
    } else {

    }
  };

  const handleSurveyResponse = ( id: string, response: string) => {
    setSurveyResponses(prev => ({...prev, [id]: response }));
  };
  const handleSurveyResponseErrors = (id: string, response: string) => {
    setSurveyResponseErrors(prev => ({...prev, [id]: response }));
  };
  const handleSurveySubmission = () => {
    //* validation here
    // just check if there are answers for all the questions
    let valid = true; 
    for(let x = 0; x < survey.pages.length; x++){
      for(let y = 0; y < survey.pages[x].questions.length; y++){
        if(!surveyResponses[`p${x + 1}_q${y + 1}`]){
          setCurrentPage(x);
          handleSurveyResponseErrors(`p${x + 1}_q${y + 1}`, `This field is required.`);
          valid = false;
        } else {
          // remove the error if its already fixed
          handleSurveyResponseErrors(`p${x + 1}_q${y + 1}`, '');
        }
      }
    }

    if(valid){
      setIsDirty(false);
      handleSubmission();
    }
  };

  //* this kickstarts the api submission >:) (chaos and things will happen)
  const handleSubmission = () => {
    // console.log("Submitting form");
    // console.log(preFormResponses);
    // console.log(surveyResponses);
    sendToServer({
      surveyID: survey.id,
      details_field: preFormResponses,
      survey_responses: surveyResponses
    });
  };

  async function sendToServer(data: ResponseFormat): Promise<any> {
    let apiAddress = `https://florals-rb.vercel.app/api/survey/submit`;
    if(import.meta.env.DEV){
      apiAddress = 'http://localhost:4000/api/survey/submit';
    }
    //console.log(`Sending DATA to ${apiAddress}`);
    try {
      const response = await fetch(apiAddress, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setFormIsSubmitted(true);
      return result;
    } 
    catch (error) {
      console.error('Error sending data to API:', error);
      throw error;
    }
  }

  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1);
  };
  const handlePrevPage = () => {
    setCurrentPage(prev => prev - 1);
  }

  React.useEffect(() => {
    topPageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentPage]);

  //* DEBUG
  const handlePrintPreForm = () => {
    console.log(preFormResponses);
  };
  const [showP, setShowP] = React.useState(false);
  const handlePrintSurvey = () => {
    //console.log("the value of p1q1 is" + surveyResponses[`p1q1`]);
    setShowP(true);
    console.log(surveyResponses);
  };
  const functionsTestPrint = () => {
    let totalQuestions = 0;
    for(let x = 0; x < survey.pages.length; x++){
      totalQuestions += survey.pages[x].questions.length;
      console.log(`survey.pages[${x}] | totalQuestions = ${totalQuestions}`);
    }

    console.log(totalQuestions);
  };

  return (
    // thin responsive column
    <div className="flex flex-col items-center h-full w-md p-4 gap-5">

      <Card ref={topPageRef} className='w-full'>
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
              id={field.id}
              title={field.title}
              type={field.type}
              optional={field.optional}
              choices={field.choices}
              limit={field.limit}
              notValidReason={preFormErrors[field.id]}
              onInputChange={(val)=> handlePreFormResponse(field.id, val)}
            />
          ))}

          <div className='w-full'>
            <Button 
              className={`w-full ${Object.keys(preFormErrors).length != 0 && 'bg-red-700 dark:bg-red-400  hover:bg-red-300 dark:hover:bg-red-200'}`} 
              onClick={handlePreFormSubmission}
            >
              {"Proceed"}
            </Button>
            { Object.keys(preFormErrors).length != 0 &&
              <p className="text-destructive text-sm text-center mt-2 font-bold">{"You have invalid inputs"}</p>
            }
            <p className="text-xs text-center mt-2">{"Note: You can't go back to this page later"}</p>
          </div>
          
        </>
      ) : 
      //* This is after the pre-form (the proceed button is clicked) 
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
              id={question.id}
              question={question.question}
              value={surveyResponses[question.id] || ""}
              notValidReason={surveyResponseErrors[question.id]}
              onRadioChange={(val) => handleSurveyResponse(question.id, val)}
            />
          ))}

          <div className="flex flex-row w-full">
            {currentPage > 0 && (
              <Button onClick={handlePrevPage}>
                {"Previous Page"}
              </Button>
            )}
            <div className="w-full"></div>
            {currentPage < survey.pages.length - 1 && (
              <Button onClick={handleNextPage}>
                {"Next Page"}
              </Button>
            )}
            {currentPage === survey.pages.length - 1 && (
              <Button 
                className={`${Object.keys(surveyResponseErrors).length != 0 && 'bg-red-700 dark:bg-red-400  hover:bg-red-300 dark:hover:bg-red-200'}`}
                onClick={handleSurveySubmission}
              >
                {"Submit"}
              </Button>
            )}
          </div>
          { Object.keys(surveyResponseErrors).length != 0 &&
            <p className="text-destructive text-sm text-right font-bold w-full">{"You have invalid inputs"}</p>
          }
          

        </>
      )}
      { //debug div weeeeeeeee
        false && (
          <div className="fixed top-1/2 left-0 ml-4 transform -translate-y-1/2 bg-accent shadow-lg p-4 rounded-lg z-50 w-xs">
            <Button className="m-2" onClick={handlePrintPreForm}>{"Print PreForm responses here"}</Button>
            <Button className="m-2" onClick={handlePrintSurvey}>{"Print Survey responses here"}</Button>
            <Button className="m-2" onClick={functionsTestPrint}>{"Print Test Functions"}</Button>
            {(showP && <pre>{JSON.stringify(surveyResponses, null, 2)}</pre>)}
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
          <FormSubmittedView/>
        )
      ) : (
        <NotFoundView/>
      )}
    </div>
  )
};

export default SurveyPage;