/**
 * Recommendations Page
 * 
 * Displays AI-powered recommendations for matching donors and receivers.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getRecommendations } from '../types/api/recommendationApi';
import { IRecommendation } from '../types/api/types';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<IRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await getRecommendations();
      setRecommendations(data);
    } catch (error: any) {
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Recommendations
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'Donor'
              ? 'Receivers who match your donation preferences'
              : 'Donors who match your request needs'}
          </p>
        </div>

        {recommendations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500 text-lg">
              No recommendations available at this time.
            </p>
            <button
              onClick={fetchRecommendations}
              className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Refresh Recommendations
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      {(rec as any).user?.name || 'User'}
                      {(rec as any).user?.isVerified && (
                        <span className="ml-2 text-green-600" title="Verified Profile">
                          ✅
                        </span>
                      )}
                    </h3>
                    {(rec as any).user?.showEmail !== false && (rec as any).user?.email && (
                      <p className="text-sm text-gray-500 mt-1">
                        {(rec as any).user.email}
                      </p>
                    )}
                    {(rec as any).user?.showLocation !== false && (rec as any).user?.location && (
                      <p className="text-sm text-gray-500">
                        Location: {(rec as any).user.location}
                      </p>
                    )}
                  </div>
                  <div className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {(rec.score * 100).toFixed(0)}% Match
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-gray-700 text-sm">
                    {rec.match_details || 'AI-matched recommendation'}
                  </p>
                </div>

                <div className="mt-6 flex space-x-2">
                  <button
                    onClick={() => {
                      const targetId = (rec as any).user?.id;
                      if (targetId) {
                        navigate(`/messages?userId=${targetId}`);
                      } else {
                        navigate('/messages');
                      }
                    }}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 text-sm"
                  >
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationsPage;

