import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import App from './app/App.jsx'
import ErrorBoundary from './components/atoms/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)