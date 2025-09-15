// File: src/components/layout/MainLayout.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useApp } from '../../context/AppContext';

// Import page components
import ContractsDashboard from '../dashboard/ContractsDashboard';
import ContractDetailPage from '../contracts/ContractDetailPage';
import PlaceholderPage from '../placeholders/PlaceholderPage';
import UploadModal from '../upload/UploadModal';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentPage } = useApp();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <ContractsDashboard />;
      case 'contract-detail':
        return <ContractDetailPage />;
      case 'insights':
        return (
          <PlaceholderPage 
            title="Insights" 
            description="Advanced analytics and insights coming soon"
            icon="BarChart3"
          />
        );
      case 'reports':
        return (
          <PlaceholderPage 
            title="Reports" 
            description="Detailed reports and analytics coming soon"
            icon="FileBarChart"
          />
        );
      case 'settings':
        return (
          <PlaceholderPage 
            title="Settings" 
            description="Application settings and preferences coming soon"
            icon="Settings"
          />
        );
      default:
        return <ContractsDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-72">
        {/* Topbar */}
        <Topbar onSidebarToggle={toggleSidebar} />
        
        {/* Page content with proper padding */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 lg:p-8">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal />
    </div>
  );
};

export default MainLayout;