//THIS IS JUST TO TEST RADIO BUTTONS BEHAVIOR WHEN LOADING ANOTHER PAGE OF A SURVEY
import { useState } from "react";
import { Button } from "../src/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import FourScaleCard from "../src/components/four-scale-card";

const survey_file = {
  "id":"230724",
  "version":"1.2",
  "title":"A Survey on Diet and Physical Activities",
  "type":"florals-4scale",
  "desc":"Based on the definitions of physical activity and exercise as you take this questionnaire, keep in mind that you can be physically active without exercising, but you cannot exercise without being physically active. Please be careful to not refresh the page as to not lose your progress. Thank you for your participation.",
  "color":"rgb(237, 255, 240)",
  "details_field":{
    "title":"Personal Information",
    "fields":[
      {
        "title":"Name (optional)",
        "type":"textbox",
        "optional":true
      },
      {
        "title":"Gender",
        "type":"radio",
        "optional":false,
        "choices":[
          "Male",
          "Female",
          "Prefer not to say"
        ]
      },
      {
        "title":"Year",
        "type":"radio",
        "optional":false,
        "choices":[
          "1",
          "2",
          "3",
          "4",
          "N/A"
        ]
      },
      {
        "title":"Block (optional)",
        "type":"number",
        "optional":true,
        "limit":10
      }
    ]
  },
  "pages":[
    {
      "title":"Section 1: Physical Activity",
      "questions":[
        "Do you identify daily time slots to be physically active?",
        "Do you seek additional opportunities to be active each day (walk, cycle, park farther away, do yard work/gardening)?",
        "Do you think physical activity improves your health and well-being?",
        "Does physical activity increase your energy level?",
        "Do you identify time slots to exercise most days of the week?",
        "Do you schedule exercise during times of the day when you feel most energetic?",
        "Do you have an alternative plan to be active or exercise during adverse weather conditions (walk at the mall, swim at the health club, climb stairs, skip rope, dance)?",
        "When you have a desire to do so, do you take classes to learn new activity/sport skills?",
        "Do you limit daily television viewing and Internet and computer game time?",
        "Do you spend leisure hours being physically active?"
      ]
    },
    {
      "title":"Section 2: Nutrition and Diet",
      "questions":[
        "Do you limit the unhealthy snacks you bring into the home and the workplace?",
        "Do you plan your meals and is your pantry well stocked so you can easily prepare a meal without a quick trip to the store?",
        "Do you help cook your meals?",
        "Do you pay attention to how hungry you are before and during a meal?",
        "When reaching for food, do you remind yourself that you have a choice about what and how much you eat?",
        "Do you eat your meals at home?",
        "Do you eat your meals at the table only?",
        "Do you include whole-grain products in your diet each day (whole-grain bread/cereal/crackers/rice/pasta)?",
        "Do you make a deliberate effort to include a variety of fruits and vegetables in your diet each day?",
        "Do you limit your daily saturated fat and trans fat intake (red meat, whole milk, cheese, butter, hard margarines, luncheon meats, baked goods, processed foods)?",
        "Do you avoid unnecessary/unhealthy snacking (at work or play, during TV viewing, at the movies or socials)?"
      ]
    }
  ]
}

interface ValuesType {
  [id: string]: string;
}

const HideableTest = () => {
  
  const [survey, setSurvey] = useState(survey_file);
  const [currentPage, setCurrentPage] = useState(0);
  const [values, setValues] = useState<ValuesType>({});

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
        {/* {survey.pages[currentPage].questions.map((question) => (
            <FourScaleCard 
              key={question.id} 
              question={question.question}
              value={surveyResponse[question.id] || ""}
              onRadioChange={(val) => handleSurveyResponse(question.id, val)}
            />
          ))} */}
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