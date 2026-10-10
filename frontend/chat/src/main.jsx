import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from "./components/ui/provider"
import LoginPage from './features/auth/LoginPage'
import RegisterPage from './features/auth/RegisterPage'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import ProtectedRoute from './features/messenger/components/ProtectedRoute'

createRoot(document.getElementById('root')).render(
  <Provider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/test" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage/>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/test" element={<App />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
)
