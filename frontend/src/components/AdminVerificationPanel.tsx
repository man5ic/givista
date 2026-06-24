/**
 * Admin Verification Panel Component
 * 
 * Allows admins to review and approve/reject KYC verification requests.
 */

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getVerificationRequests,
  approveVerification,
  rejectVerification,
} from '../types/api/verificationApi';
import { IVerification } from '../types/api/types';

const AdminVerificationPanel = () => {
  const [requests, setRequests] = useState<IVerification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const data = await getVerificationRequests();
      setRequests(data);
    } catch (error: any) {
      toast.error('Failed to load verification requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await approveVerification(id);
      toast.success('Verification approved');
      await fetchRequests();
    } catch (error: any) {
      toast.error('Failed to approve verification');
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this verification request?')) {
      return;
    }
    try {
      await rejectVerification(id);
      toast.success('Verification rejected');
      await fetchRequests();
    } catch (error: any) {
      toast.error('Failed to reject verification');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading verification requests...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Verification Requests ({requests.length})</h2>
      
      {requests.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No pending verification requests.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {requests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold">
                      {(request as any).user?.name || 'Unknown User'}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({(request as any).user?.email || 'N/A'})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Role: {(request as any).user?.role || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Submitted: {new Date(request.createdAt).toLocaleString()}
                  </p>
                  {request.documentUrl && (
                    <div className="mt-2">
                      <a
                        href={`http://localhost:3000${request.documentUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 text-sm underline"
                      >
                        View Document →
                      </a>
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerificationPanel;

