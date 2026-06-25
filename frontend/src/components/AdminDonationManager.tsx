/**
 * Admin Donation Manager Component
 * 
 * Allows admins to view and update donation statuses.
 */

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAllDonations } from '../types/api/donationApi';
import { updateDonationStatus } from '../types/api/donationTrackingApi';
import { IDonation, DonationStatus } from '../types/api/types';

const AdminDonationManager = () => {
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const data = await getAllDonations();
      setDonations(data);
    } catch (error: any) {
      toast.error('Failed to load donations');
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (donationId: number, newStatus: DonationStatus) => {
    try {
      setUpdatingId(donationId);
      await updateDonationStatus(donationId, newStatus);
      toast.success(`Donation status updated to ${newStatus}`);
      await fetchDonations(); // Refresh list
    } catch (error: any) {
      toast.error(`Failed to update donation status: ${error.message || 'Unknown error'}`);
      console.error('Error updating donation status:', error);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusOptions: DonationStatus[] = ['Pending', 'Matched', 'Dispatched', 'Received', 'Completed', 'Cancelled'];

  const filteredDonations = filterStatus === 'all' 
    ? donations 
    : donations.filter(d => d.status === filterStatus);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-8">
          <div className="text-gray-500">Loading donations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Donation Management</h2>
          <p className="text-gray-600 mt-1">View and update donation statuses</p>
        </div>
        <button
          onClick={fetchDonations}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Donations List */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {filteredDonations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No donations found {filterStatus !== 'all' ? `with status "${filterStatus}"` : ''}
          </div>
        ) : (
          filteredDonations.map((donation) => (
            <div
              key={donation.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{donation.title}</h3>
                    {donation.isVerified && (
                      <span className="text-green-600" title="Verified Donation">✅</span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{donation.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm text-gray-500">
                    <span>ID: {donation.id}</span>
                    <span>•</span>
                    <span>Category: {donation.category}</span>
                    <span>•</span>
                    <span>Quantity: {donation.quantity}</span>
                    <span>•</span>
                    <span className={`px-2 py-1 rounded font-medium ${
                      donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      donation.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      donation.status === 'Received' ? 'bg-blue-100 text-blue-800' :
                      donation.status === 'Dispatched' ? 'bg-purple-100 text-purple-800' :
                      donation.status === 'Matched' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      Current: {donation.status}
                    </span>
                  </div>
                  {donation.donor && (
                    <p className="text-sm text-gray-500 mt-2">
                      Donor: {donation.donor.name}
                      {donation.donor.showEmail !== false && donation.donor.email && (
                        <span> ({donation.donor.email})</span>
                      )}
                    </p>
                  )}
                </div>

                {/* Status Update Dropdown */}
                <div className="ml-4">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Update Status:
                  </label>
                  <select
                    value={donation.status}
                    onChange={(e) => handleStatusUpdate(donation.id, e.target.value as DonationStatus)}
                    disabled={updatingId === donation.id}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {updatingId === donation.id && (
                    <div className="text-xs text-gray-500 mt-1">Updating...</div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
          {statusOptions.map((status) => {
            const count = donations.filter(d => d.status === status).length;
            return (
              <div key={status} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-gray-600">{status}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDonationManager;

