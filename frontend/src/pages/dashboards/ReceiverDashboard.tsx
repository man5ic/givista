/**
 * Receiver Dashboard
 * 
 * Dashboard for receivers to manage requests and view recommendations.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllRequests } from '../../types/api/requestApi';
import { IRequest } from '../../types/api/types';

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<IRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      if (user) {
        const data = await getAllRequests({ receiverId: user.id });
        setRequests(data);
      }
    } catch (error: any) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                Welcome, {user?.name}!
                {user?.isVerified && (
                  <span className="ml-3 text-green-600 text-2xl" title="Verified Profile">
                    ✅
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">Manage your requests and find donors.</p>
            </div>
            <Link
              to="/privacy-settings"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Privacy Settings
            </Link>
          </div>
          {!user?.isVerified && (
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <p className="text-yellow-800 font-semibold">Verify your profile</p>
                <p className="text-yellow-700 text-sm">Get verified to build trust with other users</p>
              </div>
              <Link
                to="/verification"
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm"
              >
                Verify Now
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/receiver/create-request"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">➕</div>
            <h3 className="text-xl font-semibold mb-2">Create Request</h3>
            <p className="text-gray-600">Post a new help request</p>
          </Link>

          <Link
            to="/recommendations"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-gray-600">See matched donors</p>
          </Link>

          <Link
            to="/messages"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-xl font-semibold mb-2">Messages</h3>
            <p className="text-gray-600">Communicate with donors</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">You haven't created any requests yet.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{request.title}</h3>
                      <p className="text-gray-600 mt-1">{request.description}</p>
                      <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                        <span>Category: {request.category}</span>
                        <span className={`px-2 py-1 rounded ${
                          request.urgency === 'High' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.urgency} Urgency
                        </span>
                        <span className={`px-2 py-1 rounded ${
                          request.status === 'Fulfilled' ? 'bg-green-100 text-green-800' :
                          request.status === 'Expired' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;

