import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';

const AppRouter = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />

        {/* let's just redirect to the home for now.... */}
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;