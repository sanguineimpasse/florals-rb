import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from '@/pages/HomePage';
import SurveyPage from '@/pages/SurveyPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLayout from './pages/protected/AdminLayout';
import DashboardPage from '@/pages/protected/Dashboard';
import LoginPage from './pages/protected/LoginPage';


const AppRouter = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />}/>
        
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<DashboardPage />}/>
        </Route>
        
        <Route path="*" element={<NotFoundPage />}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;