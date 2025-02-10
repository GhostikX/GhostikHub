import Sidebar from '../scenes/Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const RootLayout = ({ isAuthenticated, setIsAuthenticated }) => {
  const location = useLocation();
  const isNotePage = location.pathname.includes('/notes/');
  
  return (
    <div className="flex h-screen">
      {isAuthenticated && !isNotePage && <Sidebar isNoteSidebar={false} setIsAuthenticated={setIsAuthenticated} />}
      <div className="flex-1">
        <Outlet /> 
      </div>
    </div>
  );
};

export default RootLayout;
