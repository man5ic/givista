/**
 * Leaderboard Page
 * 
 * Displays top donors ranked by points or donations.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getLeaderboard, LeaderboardEntry } from '../types/api/leaderboardApi';
import BadgeDisplay from '../components/BadgeDisplay';

const LeaderboardPage = () => {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'points' | 'donations'>('points');

  useEffect(() => {
    console.log('[Leaderboard] Component mounted, fetching leaderboard...');
    console.log('[Leaderboard] SortBy:', sortBy);
    fetchLeaderboard();
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    try {
      console.log('[Leaderboard] Starting fetchLeaderboard...');
      setLoading(true);
      console.log('[Leaderboard] Calling getLeaderboard API...');
      const data = await getLeaderboard(sortBy, 50);
      console.log('[Leaderboard] API call successful, received data:', data);
      setLeaderboard(data);
      if (data.length === 0) {
        console.log('[Leaderboard] Leaderboard returned empty array - no donors found');
      } else {
        console.log(`[Leaderboard] Found ${data.length} donors`);
      }
    } catch (error: any) {
      console.error('[Leaderboard] Error fetching leaderboard:', error);
      console.error('[Leaderboard] Error message:', error.message);
      console.error('[Leaderboard] Error response:', error.response);
      console.error('[Leaderboard] Error details:', error.response?.data || error);
      toast.error(`Failed to load leaderboard: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
      console.log('[Leaderboard] fetchLeaderboard completed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Top donors making a difference in the community</p>
        </div>

        {/* Sort Toggle */}
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setSortBy('points')}
            className={`px-4 py-2 rounded-lg transition ${
              sortBy === 'points'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sort by Points
          </button>
          <button
            onClick={() => setSortBy('donations')}
            className={`px-4 py-2 rounded-lg transition ${
              sortBy === 'donations'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Sort by Donations
          </button>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Donor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Badges
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed Donations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No donors found
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((entry, index) => {
                    const isCurrentUser = user?.id === entry.id;
                    return (
                      <tr
                        key={entry.id}
                        className={isCurrentUser ? 'bg-primary-50' : 'hover:bg-gray-50'}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                            {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                            {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                            <span className={`text-sm font-medium ${index < 3 ? 'text-gray-900' : 'text-gray-500'}`}>
                              #{index + 1}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {entry.photo_url ? (
                              <img
                                className="h-10 w-10 rounded-full mr-3"
                                src={entry.photo_url}
                                alt={entry.name}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-300 mr-3 flex items-center justify-center">
                                <span className="text-gray-600 text-sm font-medium">
                                  {entry.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {entry.name}
                                {isCurrentUser && (
                                  <span className="ml-2 text-primary-600 text-xs">(You)</span>
                                )}
                              </div>
                              <div className="flex flex-col">
                                {entry.email && (
                                  <span className="text-xs text-gray-500">{entry.email}</span>
                                )}
                                {entry.isVerified && (
                                  <span className="text-xs text-green-600">✓ Verified</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <BadgeDisplay badges={entry.badges || []} showTooltip={true} size="sm" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-gray-900">
                            {entry.points || 0}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {entry.completedDonations || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            to={user?.role === 'Donor' ? '/donor/dashboard' : '/'}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;

