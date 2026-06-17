import React, { useState, useEffect, useCallback } from 'react';  // ← Added useCallback
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import InternshipCard from '../components/InternshipCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const fetchData = useCallback(async () => {  // ← Wrapped with useCallback
    try {
      setLoading(true);
      if (user.role === 'user') {
        const res = await API.get('/applications/my');
        setApplications(res.data.data || []);
        const apps = res.data.data || [];
        setStats({
          total: apps.length,
          pending: apps.filter(a => a.status === 'pending').length,
          approved: apps.filter(a => a.status === 'approved').length,
          rejected: apps.filter(a => a.status === 'rejected').length,
        });
      } else {
        const res = await API.get('/internships');
        setInternships(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);  // ← Added user as dependency

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);  // ← Added fetchData to dependencies

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="mt-1 text-gray-600">
                {user?.role === 'admin' 
                  ? 'Manage internships and review applications' 
                  : 'Track your internship applications'}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {user?.role === 'admin' ? 'Administrator' : 'Student'}
              </span>
            </div>
          </div>
        </div>

        {user?.role === 'user' ? (
          // User Dashboard
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
                <Link to="/internships" className="btn-primary text-sm">
                  Browse More Internships
                </Link>
              </div>

              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500 text-lg">No applications yet</p>
                  <p className="text-gray-400 text-sm">Start applying to internships today!</p>
                  <Link to="/internships" className="btn-primary mt-4 inline-block">
                    Browse Internships
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900">{app.internship.title}</h3>
                          <p className="text-gray-600 text-sm">{app.internship.company}</p>
                          <p className="text-gray-500 text-sm">{app.internship.location}</p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className={`status-badge ${
                            app.status === 'approved' ? 'status-approved' :
                            app.status === 'rejected' ? 'status-rejected' :
                            'status-pending'
                          }`}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </span>
                          <span className="text-xs text-gray-400 mt-1">
                            Applied: {new Date(app.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          // Admin Dashboard
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Total Internships</span>
                    <span className="font-bold text-blue-600">{internships.length}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-gray-600">Open Positions</span>
                    <span className="font-bold text-green-600">
                      {internships.filter(i => i.status === 'open').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Closed Positions</span>
                    <span className="font-bold text-gray-600">
                      {internships.filter(i => i.status === 'closed').length}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link to="/internships/new" className="btn-primary w-full text-center block">
                    + Create New Internship
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Internships</h2>
                {internships.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No internships created yet</p>
                ) : (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {internships.slice(0, 5).map((internship) => (
                      <div key={internship._id} className="border-b border-gray-100 pb-3 last:border-0">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{internship.title}</p>
                            <p className="text-sm text-gray-600">{internship.company}</p>
                          </div>
                          <span className={`status-badge ${
                            internship.status === 'open' ? 'status-open' : 'status-closed'
                          }`}>
                            {internship.status.charAt(0).toUpperCase() + internship.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/applications" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center">
                <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="font-medium text-gray-900">Manage Applications</span>
                <p className="text-sm text-gray-500">Review and process student applications</p>
              </Link>
              <Link to="/internships" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition text-center">
                <svg className="h-8 w-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium text-gray-900">View All Internships</span>
                <p className="text-sm text-gray-500">Browse and manage all internship listings</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;