import React from 'react';
import { 
  FileText, 
  BarChart3, 
  Settings, 
  Upload,
  Menu,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NAVIGATION_ITEMS } from '../../utils/constants';

const Sidebar = ({ isOpen, onToggle }) => {
  const { currentPage, setCurrentPage, toggleModal } = useApp();

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleUploadClick = () => {
    toggleModal('upload');
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      FileText,
      BarChart3,
      Settings
    };
    return icons[iconName] || FileText;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''} md:translate-x-0`}>
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={onToggle}
            className="p-2 text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">ContractPro</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = getIcon(item.icon);
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`sidebar-nav-item ${
                    isActive ? 'sidebar-nav-item-active' : 'sidebar-nav-item-inactive'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Upload Button */}
          <div className="mt-8">
            <button
              onClick={handleUploadClick}
              className="w-full flex items-center gap-3 px-3 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white transition-all"
            >
              <Upload className="w-4 h-4" />
              Upload Contract
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 mt-auto border-t border-gray-800">
          <p className="text-xs text-gray-400 text-center">
            © 2024 ContractPro
          </p>
        </div>
      </div>
    </>
  );
};

export default Sidebar;