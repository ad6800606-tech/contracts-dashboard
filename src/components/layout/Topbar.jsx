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
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onSidebarToggle}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Page title with breadcrumb */}
            <div>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mb-1">
                <span>Home</span>
                <span>/</span>
                <span className="text-gray-700">{getPageTitle()}</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-3">
            {/* Search bar - hidden on mobile */}
            <div className="hidden xl:block relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contracts, parties, dates..."
                className="pl-10 pr-4 py-2.5 w-80 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Notifications dropdown */}
            <div className="relative">
              <button 
                onClick={() => toggleUIElement('notificationsOpen')}
                className="relative p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>

              {/* Notifications Dropdown */}
              {ui.notificationsOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          notif.unread ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 mt-2 rounded-full ${notif.unread ? 'bg-blue-600' : 'bg-transparent'}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.title}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help button */}
            <button className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* User dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => toggleUIElement('userDropdownOpen')}
                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* User Dropdown Menu */}
              {ui.userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                  <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                    <p className="text-sm font-medium text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      <span>View Profile</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <Settings className="w-4 h-4 text-gray-400" />
                      <span>Account Settings</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span>Billing & Plans</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                      <span>Help & Support</span>
                    </button>
                  </div>
                  <div className="px-4 py-3 border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors text-sm font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;