import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import LoginPage from './pages/protected/LoginPage';

const AppRouter = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
        <Route path="/admin/login" element={<LoginPage/>}/>

        {/* let's just redirect to the home for now.... */}
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;