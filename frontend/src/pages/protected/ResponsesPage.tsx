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
          {!tallyShown ? (
            <>
              <Card className="w-md">
                <CardContent>
                  {"Note from admin: PLEASE WAG PO KUHA NANG KUHA NG RESPONSES MULA SA DB. MAPUPUNO PO YUNG QUOTA KO SA MONGODB 😭"}
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" onClick={handleFormRet}>Display form responses</Button>
                </CardFooter>
              </Card>
            </>
          ):(
            tallyLoading ? (
              <>
                <h1 className="mb-3">Loading the tally...</h1>
                <Spinner className="w-10 h-10"/>
              </>
            ):(
              retrievalFailed ? (
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
                        <ResponseChart
                          rawData={tallyData[`details_field.${field.id}`]}
                          type="detfield"
                        />
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
                          <ResponseChart
                            rawData={tallyData[`survey_responses.${question.id}`]}
                            type="survresponses"
                          />
                        </CardContent>
                      </Card>
                    ))
                  ))}
                  
                </>
              )
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