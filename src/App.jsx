import {useState} from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useInRouterContext,
} from 'react-router-dom'
import Cookies from 'js-cookie'

import {EvaluationProvider} from './context/EvaluationContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import Assessment from './components/Assessment'
import Results from './components/Results'
import NotFound from './components/NotFound'

import './App.css'

const AppRoutes = ({history}) => {
  const [isLoggedOut, setIsLoggedOut] = useState(false)

  return (
    <Routes>
      <Route
        path="/login"
        element={
          Cookies.get('jwt_token') && !isLoggedOut ? (
            <Navigate to="/" replace />
          ) : (
            <Login
              skipAuthRedirect={isLoggedOut}
              onLogin={() => setIsLoggedOut(false)}
            />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home history={history} onLogout={() => setIsLoggedOut(true)} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assessment"
        element={
          <ProtectedRoute>
            <Assessment
              history={history}
              onLogout={() => setIsLoggedOut(true)}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <Results history={history} onLogout={() => setIsLoggedOut(true)} />
          </ProtectedRoute>
        }
      />
      <Route path="/not-found" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/not-found" replace />} />
    </Routes>
  )
}

const App = ({history}) => {
  const isInsideRouter = useInRouterContext()
  const appRoutes = (
    <EvaluationProvider>
      <AppRoutes history={history} />
    </EvaluationProvider>
  )

  return isInsideRouter ? appRoutes : <BrowserRouter>{appRoutes}</BrowserRouter>
}

export default App
