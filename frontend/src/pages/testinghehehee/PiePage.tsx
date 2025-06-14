import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import Survey from "@/types/survey_format";

import nut_survey from "@/data/nutrition_survey.json";
import sample_tally from "@/data/sample_responsetally.json";
import ResponseChart from "@/components/responsechart";

const PiePage = () => {
  const [idIsValid, setIdIsValid] = React.useState(false);
  const [viewIsLoading, setViewIsLoading] = React.useState(true);

  const [survey, setSurvey] = React.useState<Survey|null>(null);

  //* any na lang to tinatamad na ako
  const [responseTally, setResponseTally] = React.useState<any>();

  React.useEffect(() => {

    setSurvey(nut_survey);
    setResponseTally(sample_tally);
    setIdIsValid(true);

    setViewIsLoading(false);
  }, []);

  const [tallyData, setTallyData] = React.useState<any>();

  const [debugShowData, setDebugShowData] = React.useState(false);

  function handleDebugCard(){
    if(debugShowData){
      setDebugShowData(false);
    }else{
      setDebugShowData(true);
    }
  }

  const cardClasses = "w-[100%] md:w-lg mt-2";

  return(
    <>
    { false &&
      <Card className="w-md">
        <CardHeader>
          <Button variant="outline" onClick={handleDebugCard}>
            {!debugShowData ? "show raw data ▼" : "hide raw data ▲"}
          </Button>
        </CardHeader>
        { debugShowData &&
          <CardContent>
            <pre className="text-sm">{JSON.stringify(tallyData.data, null, 2)}</pre>
          </CardContent>
        }
      </Card>
    }

    {/* //!THESE CARDS WILL SHOW THE RESPONSES */}
    {survey && survey.details_field.fields.map((field)=>(
      <Card className={cardClasses} key={field.id}>
        <CardHeader>
          {`${field.title}`}
        </CardHeader>
        <CardContent>
          {false && <pre className="text-sm">{JSON.stringify(responseTally[`details_field.${field.id}`], null, 2)}</pre>}
          <ResponseChart
            rawData={responseTally[`details_field.${field.id}`]}
          />
        </CardContent>
      </Card>
    ))}
    {survey && survey.pages.map((page)=>(
      page.questions.map((question)=>(
        <Card className={cardClasses} key={question.id}>
          <CardHeader>
            {`${question.question}`}
          </CardHeader>
          <CardContent>
            {false && <pre className="text-sm">{JSON.stringify(responseTally[`survey_responses.${question.id}`], null, 2)}</pre>}
            <ResponseChart
              rawData={responseTally[`survey_responses.${question.id}`]}
            />
          </CardContent>
        </Card>
      ))
    ))}
    </>
  )
}

export default PiePage;