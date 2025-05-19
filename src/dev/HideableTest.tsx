import { useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group";

import survey_file from "./data/nutrition_survey.json";
import FourScaleCard from "./components/four-scale-card";

const HideableTest = () => {
  
  const [survey, setSurvey] = useState(survey_file);
  const [currentPage, setCurrentPage] = useState(0);

  const setPageCount = (type: string) => {
    if(type === "inc"){
      setCurrentPage(prev=>prev + 1)
    }
    else if(type === "dec"){
      setCurrentPage(prev=>prev - 1)
    }
  };

  return(
    <div className="pl-96 p-5 w-4xl">
      <h1 className="mb-5 text-4xl">
        {"This is the title of the form"}
      </h1>
      <form action="" className=" flex flex-col gap-5">
        { survey.pages[currentPage].questions.map((question, index) => (
          <FourScaleCard
            key={index}
            question={question}
            
          />
        ))}
      </form>
      <div className="flex p-4">
        { currentPage != 0 &&
          <Button onClick={()=>setPageCount("dec")}>
            {"Previous Page"}
          </Button> 
        }
        { currentPage < survey.pages.length - 1 &&
          <Button onClick={()=>setPageCount("inc")}>
            {"Next Page"}
          </Button>
        }
      </div>
      
    </div>
  )
};

export default HideableTest;