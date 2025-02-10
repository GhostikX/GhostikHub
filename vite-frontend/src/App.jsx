import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter, useNavigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoutes';
import RootLayout from './routes/RootLayout';
import { getCountry, getState } from './utils/userData';
import { fetchIP, checkSession } from './services/session-client';
import Login from './scenes/Login';
import Home from "./scenes/Home";
import Dashboard from './scenes/Dashboard';
import Calendar from './scenes/Calendar';
import NotesManagement from './scenes/NotesManagement';
import Targets from './scenes/Targets';
import Note from './scenes/Note';
import LoadingSpinner from './components/common/LoadingSpinner';
import SignUp from './scenes/SignUp';
import ConfirmationPage from './scenes/ConfirmationPage';
import NotFound from './components/NotFound';

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({ ip_address: '', location: '' });

  const checkUserData = async () => {
    try {
      setLoading(true);
      const res = await fetchIP();
      const ipAddress = res.data.ip;
      const country = getCountry();
      const city = getState();

      setUserData({
        ip_address: ipAddress,
        location: `${country}, ${city}`
      });

      await validateUserSession({ ip_address: ipAddress, location: `${country}, ${city}` });
      
    } catch (error) {
      console.log("Something wrong");
    } finally {
      setLoading(false);
    }
  };

  const validateUserSession = async (userData) => {
    try {
      const res = await checkSession(userData);
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkUserData();
  }, []);

  const router = createBrowserRouter([
      {
        element: <RootLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} username={userData.username} />,
        children: [
          {
            element: <ProtectedRoute isAuthenticated={isAuthenticated} />,
            children: [
              { path: '/notes', element: <NotesManagement setIsAuthenticated={setIsAuthenticated} /> },
              { path: '/calendar', element: <Calendar setIsAuthenticated={setIsAuthenticated} /> },
              { path: '/targets', element: <Targets setIsAuthenticated={setIsAuthenticated} /> },
              {
                path: '/dashboard',
                element: <Dashboard username={userData.username} setIsAuthenticated={setIsAuthenticated} />,
              },
              {
                path: '/notes/:noteId',
                element: <Note setIsAuthenticated={setIsAuthenticated} />,
              },
            ],
          },
        ],
      },  
      { 
        path: '/', 
        element:(
          <ProtectedRoute 
            isAuthenticated={isAuthenticated}
            redirectIfAuthenticated={true}
            redirectTo="/dashboard"
          >
            <Home /> 
          </ProtectedRoute>
        ) 
          
      },
      {
        path: '/login',
        element: (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            redirectIfAuthenticated={true}
            redirectTo="/dashboard"
          >
            <Login setIsAuthenticated={setIsAuthenticated} userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sign-up',
        element: (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            redirectIfAuthenticated={true}
            redirectTo="/dashboard"
          >
            <SignUp userData={userData} />
          </ProtectedRoute>
        ),
      },
      {
        path: '/sign-up/email-verification/',
        element: <ConfirmationPage />
      },
      {
        path: '*',
        element: <NotFound isAuthenticated={isAuthenticated} />
      }
    ],
    {
      future: {
        v7_startTransition: true,
        v7_fetcherPersist: true,
        v7_normalizeFormMethod: true,
        v7_partialHydration: true,
        v7_relativeSplatPath: true,
        v7_skipActionErrorRevalidation: true,
      }
    }
  );

  if (loading) {
    return <LoadingSpinner loading={loading} />
  }

  return (
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  )
}

export default App
