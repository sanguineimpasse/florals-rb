import { NavLink } from "react-router";
import { Button } from "@/components/ui/button";

import logo from '@/assets/favicon.ico';

const HomePage = () => {
  const flavorText = "Made w/ ❤️ by Group ";
  const pageTitle = "The Home of Simple Surveys";
  const pageDesc = `
    This is a lightweight and customizable survey platform built with React and hosted on Vercel, 
    designed for quick and efficient data collection. We are providing a clean and intuitive interface, 
    with survey content loaded from a JSON file for easy configuration.
  `;
  return(
    <div className="flex justify-center h-screen w-screen">
      
      <div className="flex flex-col items-center mt-10 md:mt-0 md:justify-center w-96 md:w-4xl ">

        <img className="m-5" src={logo} alt="Florals icon"/>
        <h3>
          {flavorText}<s>3</s> <s>6</s> <s>5</s> <s className="text-xs">We don't even know anymore 💀</s> 
        </h3>
        <h1 className="text-4xl md:text-6xl text-center p-4 md:p-6 font-bold">
          {pageTitle}
        </h1>
        <p className="md:text-lg text-center md:w-2xl">
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