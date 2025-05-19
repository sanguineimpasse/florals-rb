import { NavLink } from "react-router";
import { Button } from "./components/ui/button";

const HomePage = () => {
  const flavorText = "Made w/ ❤️ by Group 3";
  const pageTitle = "The Home of Simple Surveys";
  const pageDesc = `
    A lightweight and customizable survey platform built with React and hosted on Vercel, 
    designed for quick and efficient data collection. It provides a clean and intuitive interface, 
    with survey content loaded from a JSON file for easy configuration.
  `;
  return(
    <div className="flex justify-center h-screen w-screen">
      
      <div className="flex flex-col items-center w-4xl pt-52">
        <h3>
          {flavorText}
        </h3>
        <h1 className="text-6xl p-6 font-bold">
          {pageTitle}
        </h1>
        <p className="text-lg text-center w-2xl">
          {pageDesc}
        </p>        
        <Button className="m-6 dark:dark">
          <NavLink to="/survey/230724">
            Go to Nutrition Survey
          </NavLink>
        </Button>
      </div>
      
    </div>
  )
}

export default HomePage;