import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import SurveyPage from './pages/SurveyPage';
import NotFoundPage from './pages/NotFoundPage';

const AppRouter = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />}/>

        {/* let's just redirect to the home for now.... */}
        <Route path="*" element={<NotFoundPage />}/> 
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;