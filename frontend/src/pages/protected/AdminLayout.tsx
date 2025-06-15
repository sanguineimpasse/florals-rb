import axios, {AxiosResponse} from 'axios';
import { Outlet, Navigate, NavLink } from 'react-router';
import AuthProvider, { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';

import icon from '@/assets/favicon.ico';

const handleLogout = async () => {
  let apiAddress = '/api/admin/logout';
  if (import.meta.env.DEV) {
    apiAddress = 'http://localhost:4000/api/admin/logout';
  }
  try{
    const response: AxiosResponse<any> = await axios.post(apiAddress, {}, {
      withCredentials: true,
    });
    
    if (import.meta.env.DEV) {
      console.log(response);
    }
    window.location.reload();
    
  }catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error response:', error.response?.status, error.response?.data);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

const TopNav = () => {
  return(
    <NavLink to="/admin">
      <div className='flex flex-row justify-center items-center w-full h-16 bg-secondary p-2'>
        <img className='w-[40px] m-2' src={icon} alt="Florals icon" />
        <h1 className="w-[200px] font-bold">{"Florals "}<span className="font-normal">{"Admin"}</span></h1>
        <div className="w-full"></div>
        <Button className='' onClick={handleLogout}>
          {"Logout"}
        </Button>
      </div>
    </NavLink>
  )
};

const ProtectedContent = () => {
  const {isLoggedIn, isLoading} = useAuth();

  if (isLoading) return(
    <div className='w-full h-full bg-background'>
      {/* <p>Loading auth...</p> */}
    </div>
  )
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <>
      {isLoggedIn && <TopNav/>}
      <Outlet/>
    </>
  )
};

const AdminLayout = () => (
  <AuthProvider>
    <ProtectedContent/>
  </AuthProvider>
);

export default AdminLayout;