import { BrowserRouter, Routes, Route } from 'react-router';
import HomePage from './HomePage';
import SurveyPage from './SurveyPage';

const AppRouter = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter;