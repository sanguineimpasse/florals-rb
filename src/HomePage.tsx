import { NavLink } from "react-router";
import { Button } from "./components/ui/button";

const HomePage = () => {
  const flavorText = "Made w/ ❤️ by Group 3";
  const pageTitle = "The Home of Simple Surveys";
  const pageDesc = `
    Our survey app is a lightweight and customizable platform built with React and hosted on Vercel, 
    designed for quick and efficient data collection. It provides a clean and intuitive interface, 
    featuring a single-choice (radio button) question format, with survey content loaded from a JSON 
    file for easy configuration.\n\n
    This app is ideal for academic research, classroom feedback, or simple data gathering tasks. 
    With a focus on simplicity, privacy, and performance, it's built to be easily deployed and maintained.
  `;
  return(
    <div className="flex justify-center items-center h-screen w-screen bg-emerald-50">
      <div className="flex flex-col justify-center items-center w-3xl">
        <h3>
          {flavorText}
        </h3>
        <h1 className="text-5xl p-6">
          {pageTitle}
        </h1>
        <p>
          {pageDesc}
        </p>        
        <Button className="m-6">
          <NavLink to="/survey/230724">
            Go to Nutrition Survey
          </NavLink>
        </Button>
        
      </div>
    </div>
  )
}

export default HomePage;