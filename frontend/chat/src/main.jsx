import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestPage from './TestPage.jsx'
import { Provider } from "./components/ui/provider"
import LoginPage from './features/auth/LoginPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <Provider>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={<App />} />
      </Routes>
    </BrowserRouter>
  </Provider>
)
