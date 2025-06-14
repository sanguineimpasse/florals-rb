import React from "react";
import axios, { AxiosResponse } from "axios";
import { useNavigate } from "react-router";
import AuthProvider, {useAuth} from "@/contexts/AuthContext";

//reusables
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";

//assets
import bgImage from '@/assets/bg-full.jpg';
import icon from '@/assets/favicon.ico';
import { Spinner } from "@/components/ui/spinner";

type LoginInfo = {
  username: string,
  password: string
};

const MainView = () => {
  const navigate = useNavigate();
  const {isLoggedIn, isLoading} = useAuth();

  React.useEffect(() => {
    if(!isLoading && isLoggedIn){
      navigate('/admin');
    }
    // else{
    //   console.log("LoginPage: User is not logged in");
    // }
  },[isLoggedIn]);

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
  
  const flavorText = () => {
    if(!isDarkMode){
      return {
        header: `Access is granted not by presence, but by proof — submit your credentials, and the barrier shall discern your intent.`,
        loading: `leaves are flowing under the canopy of light - await as your credentials are proofed`
      };
    } else{
      return {
        header: `The gate stands silent, awaiting the key known only to you. Speak the secret, and the path shall reveal itself.`,
        loading: `petals stir, circuits breathe, reaching out for the key - verifying the one who seeks passage`
      };
    }
  };

  const [LoginFields, setLoginFields] = React.useState<LoginInfo>({
    username:'',
    password:''
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // optional, prevents default Enter behavior
      handleLogin();
    }
  };

  const [isLoggingIn, setIsLoggingIn] = React.useState<boolean>(false);

  const handleLogin = () => {
    if(!LoginFields.username || !LoginFields.password || LoginFields.username === '' || LoginFields.password === ''){
      setLoginFailed(true);
      setLoginError("enter your username and password.");
      return <></>;
    }
    LoginUser();
  };

  const [loginError, setLoginError] = React.useState<any>("");
  const [loginFailed, setLoginFailed] = React.useState(false);

  const LoginUser = async () => {
    let apiAddress = '/api/admin/login';
    if (import.meta.env.DEV) {
      apiAddress = 'http://localhost:4000/api/admin/login';
    }

    setIsLoggingIn(true);

    try{
      const response: AxiosResponse<any> = await axios.post(apiAddress, LoginFields, {
        withCredentials: true,
      });
      if (import.meta.env.DEV) {
        console.log(response);
      }
      navigate('/admin');
    }catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error response:', error.response?.status, error.response?.data);
        setIsLoggingIn(false);
        setLoginFailed(true);
        setLoginError("500: Server Error");
      } else {
        console.error('Unexpected error:', error);
        setIsLoggingIn(false);
        setLoginFailed(true);
        setLoginError("500: Server Error");
      }

      throw error;
    }
  };

  if(isLoading) return <></>;

  return(
    <div className="flex justify-center items-center h-full w-screen">

      {/* wrapper for the 2 columns */}
      <div className="flex flex-row h-lvh">

        {/* col 1 */}
        <div className="hidden lg:flex flex-col w-2/3 p-4 items-center justify-center">
          <img className="h-[70vw] max-h-full w-full object-cover rounded-sm shadow-md" src={bgImage} alt="decorative image"/>
        </div>
        {/* col 2 */}
        <div className="flex flex-col sm:w-xl lg:w-1/2 p-4 items-center mt-[2rem] gap-6">
          <img src={icon} alt="Florals icon" />
          <h1 className="text-xl md:text-2xl xl:text-3xl w-[70%] italic leading-normal">
            {flavorText().header}
          </h1>
          {!isLoggingIn ? (
            <Card className="flex flex-col w-[70%]">
              <CardContent className="flex flex-col gap-3" onKeyDown={handleKeyDown}>
                <form className="flex flex-col gap-3">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" placeholder="your identifier"
                    onChange={(val) => setLoginFields({ ...LoginFields, username: val.target.value })}/>

                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="the key that opens it all" 
                    onChange={(val) => setLoginFields({ ...LoginFields, password: val.target.value })}/>
                  
                  <Button onClick={handleLogin}>
                    {"Login"}
                  </Button>
                </form>
              </CardContent>
              {loginFailed &&
                <CardFooter>
                  <p className="text-destructive text-sm text-center w-full">{loginError}</p>
                </CardFooter>
              }
            </Card>
          ):(
            <>
              <p className="italic w-[20vw] text-sm mt-5">
                {flavorText().loading}
              </p>
              <Spinner className="w-10 h-10"/>
            </>
          )}
        </div>

      </div>

    </div>
  )
};

const LoginPage = () => {
  return(
    <AuthProvider>
      <MainView/>
    </AuthProvider>
  )
}

export default LoginPage;