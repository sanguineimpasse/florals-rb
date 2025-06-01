import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

//I wanna be a provider
function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    //console.log("Checking if user is logged in...");
    const checkSession = async () => {
      try {
        let apiAddress = '/api/admin/session';
        if (import.meta.env.DEV) {
          apiAddress = 'http://localhost:4000/api/admin/session';
        }
        const res: any = await axios.get(apiAddress, { withCredentials: true });
        //console.log(res.data.isLoggedIn ? "User is logged in" : "User is NOT logged in");
        setIsLoggedIn(res.data.isLoggedIn);
      } catch(error){
        //console.error("Error in session validation (most likely a connection time-out)");
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const authValue = useMemo(() => ({
    isLoggedIn,
    isLoading,
  }), [isLoggedIn, isLoading]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider"); //return error if used outside provider
  }
  return context;
}

export default AuthProvider;
