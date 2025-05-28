import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

import bgImage from '@/assets/bg-full.jpg';
import icon from '@/assets/favicon.ico';

type LoginInfo = {
  username: string,
  password: string
};

const LoginPage = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(() =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDarkMode(event.matches);
    };
    mediaQuery.addEventListener("change", handleChange);
    // Cleanup on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const [LoginFields, setLoginFields] = React.useState<LoginInfo>({
    username:'',
    password:''
  });

  const FlavorText = () => {
    if(!isDarkMode){
      return `Access is granted not by presence, but by proof — submit your credentials, and the barrier shall discern your intent.`;
    } else{
      return `The gate stands silent, awaiting the key known only to you. Speak the secret, and the path shall reveal itself.`;
    }
  };

  const handleLogin = () => {
    console.log(LoginFields);
  };

  return(
    <div className="flex justify-center items-center h-full w-screen">

      {/* wrapper for the 2 columns */}
      <div className="flex flex-row h-lvh">

        {/* col 1 */}
        <div className="hidden lg:flex flex-col w-2/3 p-4 items-center justify-center">
          <img className="h-[70vw] max-h-full w-full object-cover rounded-sm shadow-md" src={bgImage} alt="decorative image"/>
        </div>
        {/* col 2 */}
        <div className="flex flex-col sm:w-xl lg:w-1/2 p-4 items-center mt-[8%] gap-6">
          <img src={icon} alt="Florals icon" />
          <h1 className="text-xl md:text-2xl xl:text-3xl w-[70%] italic leading-normal">
            {<FlavorText/>}
          </h1>
          <Card className="flex flex-col w-[70%]">
            <CardContent className="flex flex-col gap-3">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="your identifier" 
                onChange={(val) => setLoginFields({ ...LoginFields, username: val.target.value })}/>

              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="the key that opens it all" 
                onChange={(val) => setLoginFields({ ...LoginFields, password: val.target.value })}/>
              
              <Button onClick={handleLogin}>
                {"Login"}
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
};

export default LoginPage;