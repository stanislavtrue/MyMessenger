import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TestPage from './TestPage.jsx'
import { Provider } from "./components/ui/provider"

createRoot(document.getElementById('root')).render(
  <Provider>
    <TestPage />
  </Provider>
)
