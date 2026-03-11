import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, Bell, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../images/logo.png';

import { getApiEndpoint } from '../../utils/api';
import { getAvatarSrc } from '../../utils/avatar';
import { useTheme } from '../../context/ThemeContext';

const Header: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  const { isDark, toggleTheme } = useTheme();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    closeMobileMenu();
  }, [location]);
  useEffect(() => {
    const fetchNotificationCount = async () => {
      if (!currentUser) return;

      try {
        const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
        const response = await fetch(getApiEndpoint('/api/notifications'), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          const unreadCount = (data.notifications || []).filter((n: { read: any; }) => !n.read).length;
          setNotificationCount(unreadCount);
        }
      } catch (err) {
        console.error('Error fetching notification count:', err);
      }
    };

    fetchNotificationCount();

    // Refresh notification count every minute
    const intervalId = setInterval(fetchNotificationCount, 60000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 duration-300 transition-all ${isScrolled || mobileMenuOpen || location.pathname !== '/'
        ? 'bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/50'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="TagAlong" className="h-8 w-8" />
            <span className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              TagAlong
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium ${location.pathname === '/' ? 'text-teal-500' : 'text-gray-700 dark:text-gray-300 hover:text-teal-500'
                } transition-colors`}
            >
              Home
            </Link>
            <Link
              to="/search"
              className={`text-sm font-medium ${location.pathname === '/search' ? 'text-teal-500' : 'text-gray-700 dark:text-gray-300 hover:text-teal-500'
                } transition-colors`}
            >
              Find Trips
            </Link>
            <Link
              to="/listings/create"
              className={`text-sm font-medium ${location.pathname === '/listings/create' ? 'text-teal-500' : 'text-gray-700 dark:text-gray-300 hover:text-teal-500'
                } transition-colors`}
            >
              List Your Trip
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium ${location.pathname === '/about' ? 'text-teal-500' : 'text-gray-700 dark:text-gray-300 hover:text-teal-500'
                } transition-colors`}
            >
              About Us
            </Link>
          </nav>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            {isAuthenticated ? (
              <>
                <Link
                  to="/messages"
                  className="text-gray-700 dark:text-gray-300 hover:text-teal-500 transition-colors"
                  aria-label="Messages"
                >
                  <MessageSquare size={20} />
                </Link>
                <Link
                  to="/notifications"
                  className="text-gray-700 dark:text-gray-300 hover:text-teal-500 transition-colors"
                  aria-label="Notifications"
                >
                  <div className="relative">
                    <Bell size={20} />
                    {notificationCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <img
                      src={getAvatarSrc(currentUser?.avatar, currentUser?.name)}
                      alt={currentUser?.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentUser?.name.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 dark:ring-gray-700 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-150">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/myparcel"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      My Parcels
                    </Link>
                    <Link
                      to="/mytrips"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      My Trips
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="bg-teal-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-900/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              Find Trips
            </Link>
            <Link
              to="/listings/create"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              List Your Trip
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              About Us
            </Link>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            {isAuthenticated ? (
              <div>
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      src={getAvatarSrc(currentUser?.avatar, currentUser?.name)}
                      alt={currentUser?.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">{currentUser?.name}</div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentUser?.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/messages"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Messages
                  </Link>
                  <Link
                    to="/notifications"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    aria-label="Notifications"
                  >
                    <div className="relative">
                      {/* <Bell size={20} /> */}
                      {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                          {notificationCount > 9 ? '9+' : notificationCount}
                        </span>
                      )}
                    </div>
                    Notification
                  </Link>
                  <Link
                    to="/myparcel"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    My Parcels
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1 px-4">
                <Link
                  to="/login"
                  className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-teal-500 hover:bg-gray-50 dark:hover:bg-gray-800 px-3 py-2 rounded-md"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block text-base font-medium bg-teal-500 text-white hover:bg-teal-600 px-3 py-2 rounded-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
