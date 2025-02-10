import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isAuthenticated, redirectIfAuthenticated, redirectTo = "/", children }) => {
  if (redirectIfAuthenticated && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (!redirectIfAuthenticated && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children || <Outlet />;
};

export default ProtectedRoute;