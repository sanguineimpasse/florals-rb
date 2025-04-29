import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './components/ui/theme-provider';
import AppRouter from './AppRouter';
import './index.css'

//get user's color mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const scheme = prefersDark ? 'dark' : 'light';
console.log(`User prefers ${scheme} mode`);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AppRouter/>
    </ThemeProvider>
  </StrictMode>,
)
