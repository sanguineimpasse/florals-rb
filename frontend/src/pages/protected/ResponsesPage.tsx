import React from "react";
import { useParams } from "react-router";
import axios, { AxiosResponse } from "axios";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import Survey from "@/types/survey_format";

import nut_survey from "@/data/nutrition_survey.json";
import ResponseChart from "@/components/responsechart";

const ResponsesPage = () => {
  const params = useParams();

  const [idIsValid, setIdIsValid] = React.useState(false);
  const [viewIsLoading, setViewIsLoading] = React.useState(true);

  const [survey, setSurvey] = React.useState<Survey|null>(null);

  React.useEffect(() => {
    if (params.id === '230724') {
      setSurvey(nut_survey);
      setIdIsValid(true);
    }
    setViewIsLoading(false);
  }, [params]);

  
  const [tallyShown, setTallyShown] = React.useState(false);
  const [tallyLoading, setTallyLoading] = React.useState(true);
  const [retrievalFailed, setRetrievalFailed] = React.useState(false);
  const [retrievalError, setRetrievalError] = React.useState<any>();
  const [tallyData, setTallyData] = React.useState<any>();

  const [nutritionShown, setNutritionShown] = React.useState(false);
  const [nutritionLoading, setNutritionLoading] = React.useState(false);
  const [nutritionData, setNutritionData] = React.useState<any>();
  const [nutritionError, setNutritionError] = React.useState<any>();
  const [nutritionFailed, setNutritionFailed] = React.useState(false);

function handleNutritionRet() {
  setNutritionShown(true);
  setNutritionLoading(true);
  setNutritionFailed(false);
  setNutritionError(null);

  let apiAddress = `/api/data/get-nutrition-responses`;
  if (import.meta.env.DEV) {
    apiAddress = 'http://localhost:4000/api/data/get-nutrition-responses';
  }

  axios
    .get(apiAddress, { withCredentials: true })
    .then((response: AxiosResponse<any>) => {
      if (import.meta.env.DEV) {
        console.log("Nutrition response:", response);
      }
      setNutritionData(response.data);
    })
    .catch((error: unknown) => {
      setNutritionFailed(true);
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error);
        setNutritionError("Axios error: " + error.message);
      } else {
        console.error("Unexpected error:", error);
        setNutritionError("Unexpected error: " + error);
      }
    })
    .finally(() => {
      setNutritionLoading(false);
    });
}


  const [debugShowData, setDebugShowData] = React.useState(false);

  function handleFormRet(){
    setTallyShown(true);
    queryDB();
  }

  async function queryDB(): Promise<any>{
    let apiAddress = `/api/data/get-responses`;
    if (import.meta.env.DEV) {
      apiAddress = 'http://localhost:4000/api/data/get-responses';
    }

    try{
      const response: AxiosResponse<any> = await axios.get(apiAddress, {
        withCredentials: true // ensures cookies are sent with CORS requests if needed
      });
      if (import.meta.env.DEV) {
        console.log(response);
      }
      setTallyData(response.data);
      setTallyLoading(false);
    }catch(error: unknown){
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.status, error.response?.data);
        setTallyLoading(false);
        setRetrievalFailed(true);
        setRetrievalError("Axios error: " + error.message);
      } else {
        console.error('Unexpected error:', error);
        setTallyLoading(false);
        setRetrievalFailed(true);
        setRetrievalError("Unexpected error" + error);
      }

      throw error;
    }
  }

  function handleDebugCard(){
    if(debugShowData){
      setDebugShowData(false);
    }else{
      setDebugShowData(true);
    }
  }

  //classes
  const cardClasses = "w-[100%] md:w-lg";

  return(
    <>
    {idIsValid ? (
      <div className="flex flex-col justify-center h-full w-screen">
        
        <div className="flex flex-col p-5 gap-2">
          <h1 className="text-2xl mb-4">Viewing responses for <span className="font-bold">Nutrition Survey</span></h1>
{!tallyShown && !nutritionShown ? (
  <>
 <Card className="w-md">
      <CardContent>
        {"Note from admin: PLEASE WAG PO KUHA NANG KUHA NG RESPONSES MULA SA DB. MAPUPUNO PO YUNG QUOTA KO SA MONGODB 😭"}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={handleFormRet}>
          Display form responses
        </Button>
      </CardFooter>
    </Card>
 <Card className="w-md">
      <CardContent>
        {"Note: This will load ONLY the Nutrition & Diet section, useful if you want to save on DB bandwidth."}
      </CardContent>
      <CardFooter>
        <Button className="w-full" variant="outline" onClick={handleNutritionRet}>
          Display only Nutrition responses
        </Button>
      </CardFooter>
    </Card>
  </>
):(tallyLoading ? (
              <>
              </>
            ):(retrievalFailed ? (
                <Card>
                  <CardContent>
                    <h1 className="text-destructive">Retrieval Error</h1>
                      <p className="text-destructive">{retrievalError}</p>
                  </CardContent>
                </Card>
              ) : (
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
                          <pre className="text-sm">{JSON.stringify(tallyData, null, 2)}</pre>
                        </CardContent>
                      }
                    </Card>
                  }

                  {/* //!THESE CARDS WILL SHOW THE RESPONSES */}
                  <Card className={cardClasses}>
                    <CardContent>
                      <p>{"Total responses: "}<span className="font-bold">{tallyData["total_responses"]}</span></p>
                    </CardContent>
                  </Card>
                  {survey && survey.details_field.fields.map((field)=>(
                    <Card className={cardClasses} key={field.id}>
                      <CardHeader>
                        <CardTitle>
                          {`${field.title}`}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {false && <pre className="text-sm">{JSON.stringify(tallyData[`details_field.${field.id}`], null, 2)}</pre>}
                    {tallyData[`details_field.${field.id}`] && (
                      <ResponseChart
                        rawData={tallyData[`details_field.${field.id}`]}
                        type="detfield"
                      />
                  )}
                      </CardContent>
                    </Card>
                  ))}
                  {survey && survey.pages.map((page)=>(
                    page.questions.map((question)=>(
                      <Card className={cardClasses} key={question.id}>
                        <CardHeader>
                          <CardTitle>
                            {`${question.question}`}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {false && <pre className="text-sm">{JSON.stringify(tallyData[`survey_responses.${question.id}`], null, 2)}</pre>}
{tallyData[`survey_responses.${question.id}`] && (
  <>
    <ResponseChart
      rawData={tallyData[`survey_responses.${question.id}`]}
      type="survresponses"
    />
    {(() => {
      const data = tallyData[`survey_responses.${question.id}`] as Record<string, number>;
      const entries = Object.entries(data);
      const total = entries.reduce((acc, [, count]) => acc + count, 0);
      const sorted = [...entries].sort((a, b) => b[1] - a[1]);

      if (sorted.length === 0) return null;

      const [topAnswer, topCount] = sorted[0];
      const percentage = ((topCount / total) * 100).toFixed(1);

      return (
        <p className="mt-2 text-sm text-muted-foreground">
          {`Top answer: "${topAnswer}" with ${percentage}% (${topCount} out of ${total})`}
        </p>
      );
    })()}
  </>
)}
                        </CardContent>
                      </Card>
                    ))
                  ))}
                </>
              )
            )
          )}

          {/* 👉 Nutrition Only Section Display */}
{nutritionShown && (nutritionLoading ? (
  <>
    <h1 className="mb-3">Loading the nutrition responses...</h1>
    <Spinner className="w-10 h-10" />
  </>
) : nutritionFailed ? (
              <Card className="w-md mt-4">
                <CardContent>
                  <h1 className="text-destructive">Nutrition Retrieval Error</h1>
                  <p className="text-destructive">{nutritionError}</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className={cardClasses}>
                  <CardContent>
                    <p>{"Total responses: "}<span className="font-bold">{nutritionData["total_responses"]}</span></p>
                  </CardContent>
                </Card>

                {survey && survey.pages.find(page => page.title.includes("Nutrition"))?.questions.map((question) => (
                  <Card className={cardClasses} key={`nutrition-${question.id}`}>
                    <CardHeader>
                      <CardTitle>
                        {`${question.question}`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
{nutritionData[`survey_responses.${question.id}`] && (
  <>
    <ResponseChart
      rawData={nutritionData[`survey_responses.${question.id}`]}
      type="survresponses"
    />
    {(() => {
const data = nutritionData[`survey_responses.${question.id}`];

// Corrected mapping
const always = data[4] || 0;
const often = data[3] || 0;
const seldom = data[2] || 0;
const never = data[1] || 0;

const total = always + often + seldom + never;

let interpretation = "";

if (total === 0) {
  interpretation = "No responses available.";
} else {
  const alwaysRate = (always / total) * 100;
  const oftenRate = (often / total) * 100;
  const seldomRate = (seldom / total) * 100;
  const neverRate = (never / total) * 100;

  console.log("→ Corrected Rates:", {
    Always: alwaysRate,
    Often: oftenRate,
    Seldom: seldomRate,
    Never: neverRate
  });

  if (oftenRate >= 50 && seldomRate >= 30 && neverRate >= 10 && alwaysRate >= 20) {
    interpretation = "Mixed habit: strong practice with signs of inconsistency and neglect.";
  } else if (alwaysRate >= oftenRate && alwaysRate >= seldomRate && alwaysRate >= neverRate) {
    interpretation = `Most participants always follow this habit (${alwaysRate.toFixed(1)}%).`;
  } else if (oftenRate >= seldomRate && oftenRate >= neverRate && oftenRate >= alwaysRate) {
    interpretation = `Most participants often follow this habit (${oftenRate.toFixed(1)}%).`;
  } else if (seldomRate >= oftenRate && seldomRate >= neverRate && seldomRate >= alwaysRate) {
    interpretation = `Most participants only seldom follow this habit (${seldomRate.toFixed(1)}%).`;
  } else if (neverRate >= oftenRate && neverRate >= seldomRate && neverRate >= alwaysRate) {
    interpretation = `Most participants never follow this habit (${neverRate.toFixed(1)}%).`;
  } else {
    interpretation = "Responses are mixed with no clear majority.";
  }
}

      return (
        <p className="mt-2 text-sm text-muted-foreground italic">
          {interpretation}
        </p>
      );
    })()}
  </>
)}

                    </CardContent>
                  </Card>
                ))}
              </>
            )
          )}
        </div>
      </div>
    ) :(
      viewIsLoading ? (
        <></>
      ):(
        <div className="p-10">
          <h1 className="text-3xl text-destructive font-bold">{"Unable show responses"}</h1>
          <p className="mt-2 ">{"Survey Not Found"}</p>
        </div>
      )
    )}
    </>
  )
}

export default ResponsesPage;
