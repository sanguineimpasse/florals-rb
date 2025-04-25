import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router';
import './index.css'

import HomePage from './HomePage';
import SurveyPage from './SurveyPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/survey/:id" element={<SurveyPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
