import { useState } from 'react';
import GlobalLoading from './GlobalLoading';
import HradminNavbar from './HradminNavbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <>
      <GlobalLoading />
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <HradminNavbar />
        
        {/* Main Content with Sidebar */}
        <div className="flex">
          {/* Sidebar */}
          <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
          
          {/* Main Content Area */}
          <main className={`flex-1 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout; 