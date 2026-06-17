import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';  // ← ADDED THIS
import { useAuth } from '../context/AuthContext';
import API from '../api';
import InternshipCard from '../components/InternshipCard';

const Internships = () => {
  const { user } = useAuth();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [appliedInternships, setAppliedInternships] = useState(new Set());

  useEffect(() => {
    fetchInternships();
    if (user?.role === 'user') {
      fetchUserApplications();
    }
  }, [user]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const res = await API.get('/internships');
      setInternships(res.data.data || []);
    } catch (err) {
      console.error('Error fetching internships:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const res = await API.get('/applications/my');
      const apps = res.data.data || [];
      const appliedIds = new Set(apps.map(app => app.internship._id));
      setAppliedInternships(appliedIds);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApply = async (internshipId) => {
    try {
      await API.post('/applications', { internshipId });
      alert('✅ Application submitted successfully!');
      await fetchUserApplications();
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Error applying for internship';
      alert(`❌ ${errorMsg}`);
    }
  };

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch = internship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         internship.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || internship.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading internships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Internships</h1>
            <p className="mt-1 text-gray-600">
              Find the perfect internship opportunity for you
            </p>
          </div>
          {user?.role === 'admin' && (
            <div className="mt-4 md:mt-0">
              <Link to="/internships/new" className="btn-primary">
                + Create Internship
              </Link>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-auto"
              >
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="text-sm text-gray-500">
              {filteredInternships.length} internships found
            </div>
          </div>
        </div>

        {filteredInternships.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-gray-500 text-lg">No internships found</p>
            <p className="text-gray-400 text-sm">
              {searchTerm ? 'Try adjusting your search terms' : 'Check back later for new opportunities'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredInternships.map((internship) => (
              <div key={internship._id} className="relative">
                <InternshipCard
                  internship={internship}
                  onApply={user?.role === 'user' ? handleApply : null}
                />
                {user?.role === 'user' && appliedInternships.has(internship._id) && (
                  <div className="absolute top-4 right-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                    Applied ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Internships;