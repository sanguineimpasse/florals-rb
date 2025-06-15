import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router";

import Survey from "@/types/survey_format";

import survey_imported from "@/data/nutrition_survey.json";


type RetSurveysType = {
  [key: string] : Survey;
}

const DashboardPage = () => {
  const [retrievedSurveys, setRetrievedSurveys] = React.useState<RetSurveysType>({});

  React.useEffect(() => {
    setRetrievedSurveys(prevState => ({...prevState, "230724": survey_imported}));
  }, []);

  const handleNewMessage = () => {
    window.alert("Not Implemented yet hehe")
  };

  return(
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center h-full w-full p-4 gap-2">
      {/* col1 */}
      <div className="flex flex-col items-left justify-center gap-2">
        <div className="flex h-[50%]">
          <Card className="w-sm md:w-md lg:w-lg">
            <CardHeader>
              <CardTitle>
                Surveys
              </CardTitle>
              <CardDescription>
                View all the surveys and their responses here
              </CardDescription>
            </CardHeader>
            <CardContent>
              {retrievedSurveys["230724"] && 
                <div className="flex flex-col gap-4 p-8 outline rounded-2xl hover:outline-2 hover:outline-ring">
                  <h1 className="font-bold text-2xl">
                    {retrievedSurveys["230724"].title}
                  </h1>
                  <p className="text-xs text-primary">
                    {retrievedSurveys["230724"].desc}
                  </p>
                  <div className="flex flex-row gap-2 w-full">
                    <Button className="p-0 w-[50%]">
                      <NavLink className="w-full h-full p-2" to="/admin/responses/230724">
                        View Responses
                      </NavLink>
                    </Button>
                    <Button className="p-0 w-[50%]" variant="outline" >
                      <NavLink className="w-full h-full p-2" to="/survey/230724">
                        View Survey
                      </NavLink>
                    </Button>
                  </div>
                </div>
              }

            </CardContent>
          </Card>
        </div>
        <div className="flex h-[50%]">
          <Card className="w-sm md:w-md lg:w-lg">
            <CardHeader>
              <CardTitle>
                Recent Responses
              </CardTitle>
              <CardDescription>
                View an individual response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This feature is not implemented yet...</p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* col2 */}
      <div className="flex flex-col items-left">
        <Card className="w-sm md:w-sm lg:w-lg min-h-3xl">
          <CardHeader>
            <CardTitle>
              Message Board
            </CardTitle>
            <CardDescription>
              Messages from admins
            </CardDescription>
            <CardAction>
              <Button variant="outline" onClick={handleNewMessage}>
                Add New Message
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-sm">No new messages for now...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
};

export default DashboardPage;