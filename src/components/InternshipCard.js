import React from 'react';

const InternshipCard = ({ internship, onApply }) => {
  const { title, company, location, description, stipend, status, createdBy } = internship;

  const getStatusBadge = (status) => {
    const statusMap = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStipendText = (amount) => {
    if (amount === 0) return 'Unpaid';
    return `₹${amount.toLocaleString()}/month`;
  };

  return (
    <div className="card p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <p className="text-gray-600 font-medium">{company}</p>
        </div>
        <span className={`status-badge ${getStatusBadge(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <div className="mt-2 flex items-center text-gray-500 text-sm">
        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {location}
      </div>

      <p className="mt-3 text-gray-600 text-sm line-clamp-2">{description}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-green-600 font-bold">{getStipendText(stipend)}</span>
          {createdBy && (
            <span className="text-gray-400 text-xs">Posted by {createdBy.name}</span>
          )}
        </div>
        {onApply && status === 'open' && (
          <button
            onClick={() => onApply(internship._id)}
            className="btn-primary text-sm px-4 py-1.5"
          >
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;