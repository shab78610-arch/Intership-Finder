import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-xl font-bold">Internship Finder</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/internships" className="hover:text-blue-200 transition px-3 py-2 rounded-md text-sm font-medium">
                  Browse
                </Link>
                {user.role === 'admin' && (
                  <Link to="/internships/new" className="hover:text-blue-200 transition px-3 py-2 rounded-md text-sm font-medium">
                    + Create
                  </Link>
                )}
                <div className="flex items-center space-x-3 ml-4">
                  <span className="text-sm text-blue-200">
                    👋 {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-sm font-medium transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md text-sm font-medium transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-blue-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700 px-4 py-2">
          <div className="space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" className="block hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <Link to="/internships" className="block hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium">
                  Browse Internships
                </Link>
                {user.role === 'admin' && (
                  <Link to="/internships/new" className="block hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium">
                    Create Internship
                  </Link>
                )}
                <div className="border-t border-blue-500 mt-2 pt-2">
                  <span className="block px-3 py-2 text-sm text-blue-200">👋 {user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium">
                  Login
                </Link>
                <Link to="/register" className="block hover:bg-blue-600 px-3 py-2 rounded-md text-base font-medium">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;