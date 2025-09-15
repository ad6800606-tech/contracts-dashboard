import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  TrendingUp, 
  FileBarChart, 
  Settings, 
  Upload,
  HelpCircle,
  LogOut,
  ChevronLeft,
  User
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onToggle }) => {
  const { currentPage, setCurrentPage, toggleModal } = useApp();
  const { user, logout } = useAuth();

  // Fix: Use toggleModal instead of toggleUIElement for upload modal
  const handleUploadClick = () => {
    toggleModal('upload');
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'contracts', label: 'Contracts', icon: FileText },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ];

  const bottomItems = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  return (
    <div className="flex h-full flex-col bg-white border-r border-gray-200">
      {/* Header Section - Reduced padding */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">ContractPro</h1>
            <p className="text-xs text-gray-500">Enterprise</p>
          </div>
        </div>
        {/* Close button for mobile */}
        <button
          onClick={onToggle}
          className="lg:hidden p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* User Profile Section - Compact */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'John Doe'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || 'john@company.com'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation - Optimized spacing */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                if (onToggle && isOpen) onToggle(); // Close mobile sidebar after navigation
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-100' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}

        {/* Upload Button - Prominent placement */}
        <div className="pt-4">
          <button
            onClick={handleUploadClick}
            className="w-full flex items-center space-x-3 px-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Contract</span>
          </button>
        </div>
      </nav>

      {/* Bottom Section - Compact */}
      <div className="border-t border-gray-200 p-3 space-y-1">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                if (onToggle && isOpen) onToggle();
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg text-sm transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;