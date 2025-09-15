// File: src/components/layout/Topbar.jsx
import React, { useRef, useEffect, useState } from 'react';
import { 
  User, 
  ChevronDown, 
  LogOut, 
  Settings, 
  Menu,
  Bell,
  Search,
  HelpCircle,
  UserCircle,
  CreditCard,
  Moon,
  Sun
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useApp } from '../../context/AppContext';

const Topbar = ({ onSidebarToggle }) => {
  const { user, logout } = useAuth();
  const { ui, toggleUIElement, currentPage } = useApp();
  const dropdownRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (ui.userDropdownOpen) {
          toggleUIElement('userDropdownOpen');
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [ui.userDropdownOpen, toggleUIElement]);

  const handleLogout = () => {
    logout();
    toggleUIElement('userDropdownOpen');
  };

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard Overview',
      contracts: 'Contracts Management',
      insights: 'Analytics & Insights',
      reports: 'Reports Center',
      settings: 'Settings & Preferences'
    };
    return titles[currentPage] || 'Dashboard';
  };

  const notifications = [
    { id: 1, title: 'Contract Expiring', message: 'ABC Corp contract expires in 7 days', time: '2h ago', unread: true },
    { id: 2, title: 'New Risk Alert', message: 'High risk detected in XYZ agreement', time: '5h ago', unread: true },
    { id: 3, title: 'Upload Complete', message: 'Successfully processed 3 contracts', time: '1d ago', unread: false },
  ];

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center">
      <div className="flex-1 flex items-center justify-between px-4 lg:px-6">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onSidebarToggle}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title with breadcrumb */}
          <div>
            <div className="hidden sm:flex items-center space-x-2 text-xs text-gray-500 mb-0.5">
              <span>Home</span>
              <span>/</span>
              <span className="text-gray-700">{getPageTitle()}</span>
            </div>
            <h1 className="text-lg lg:text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-2 lg:space-x-4">
          {/* Search bar - hidden on small screens */}
          <div className="hidden xl:block relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contracts..."
              className="pl-9 pr-4 py-2 w-64 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {notifications.filter(n => n.unread).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => toggleUIElement('userDropdownOpen')}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-gray-600" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name || 'John Doe'}</p>
                <p className="text-xs text-gray-500">{user?.role || 'Admin'}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {/* Dropdown menu */}
            {ui.userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'John Doe'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'john@company.com'}</p>
                </div>
                
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <UserCircle className="w-4 h-4 mr-3" />
                  Profile Settings
                </button>
                
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <Settings className="w-4 h-4 mr-3" />
                  Preferences
                </button>
                
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <CreditCard className="w-4 h-4 mr-3" />
                  Billing
                </button>
                
                <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <HelpCircle className="w-4 h-4 mr-3" />
                  Help & Support
                </button>
                
                <div className="border-t border-gray-100 mt-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;  