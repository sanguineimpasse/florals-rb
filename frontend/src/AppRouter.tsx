import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@/pages/HomePage';
import SurveyPage from '@/pages/SurveyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PiePage from './pages/testinghehehee/piepage';

//protected pages
import AdminLayout from './pages/protected/AdminLayout';
import DashboardPage from '@/pages/protected/Dashboard';
import LoginPage from './pages/protected/LoginPage';
import ResponsesPage from './pages/protected/ResponsesPage';


const AppRouter = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />}/>
        <Route path="/pie" element={<PiePage />}/>
        
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<DashboardPage />}/>
          <Route path="/admin/responses/:id" element={<ResponsesPage/>}/>
        </Route>
        
        <Route path="*" element={<NotFoundPage />}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;