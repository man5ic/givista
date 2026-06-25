<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { BADGE_DEFINITIONS } from '../../utils/badgeDefinitions';
import api from '../../types/api/apiService';

interface Donation {
  id: number;
  title: string;
  category: string;
  quantity: number;
  status: string;
  isVerified: boolean;
  photo_url?: string;
  createdAt: string;
}

const categoryIcon: Record<string, string> = { Money: '💰', Food: '🍱', Clothes: '👗', Blood: '🩸', Other: '📦' };

const statusColor = (s: string) => {
  if (s === 'Completed') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
  if (s === 'Matched') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (s === 'Pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
  if (s === 'Dispatched') return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300';
  return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
};

const DonorDashboard = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/donations/my');
        setDonations(res.data.data || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = donations.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === 'All' || d.category === filterCategory;
    const matchStatus = filterStatus === 'All' || d.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const stats = {
    total: donations.length,
    completed: donations.filter(d => d.status === 'Completed').length,
    pending: donations.filter(d => d.status === 'Pending').length,
    verified: donations.filter(d => d.isVerified).length,
  };

  const userBadges = user?.badges || [];
  const earnedBadges = BADGE_DEFINITIONS.filter(b => userBadges.includes(b.id));
  const unearnedBadges = BADGE_DEFINITIONS.filter(b => !userBadges.includes(b.id)).slice(0, 3);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />)}
=======
/**
 * Donor Dashboard
 * 
 * Dashboard for donors to manage donations and view recommendations.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { getAllDonations } from '../../types/api/donationApi';
import { IDonation } from '../../types/api/types';
import DonationProgress from '../../components/DonationProgress';
import BadgeDisplay from '../../components/BadgeDisplay';
import ViewBadgesModal from '../../components/ViewBadgesModal';

const DonorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const [donations, setDonations] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBadgesModal, setShowBadgesModal] = useState(false);

  useEffect(() => {
    fetchDonations();
    // Refresh user data to get updated points and badges
    refreshUser();
  }, []);

  const fetchDonations = async () => {
    try {
      if (user) {
        const data = await getAllDonations({ donorId: user.id });
        setDonations(data);
      }
    } catch (error: any) {
      toast.error('Failed to load donations');
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
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.photo_url ? (
              <img src={user.photo_url} alt={user.name} className="w-16 h-16 rounded-full object-cover border-4 border-white/30" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-primary-100">Donor Dashboard</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {user?.isVerified && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">✅ Verified</span>}
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">🏅 {user?.points || 0} pts</span>
                {earnedBadges.length > 0 && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">🏆 {earnedBadges.length} badges</span>}
              </div>
            </div>
          </div>
          <Link to="/donor/create-donation" className="px-6 py-3 bg-white text-primary-700 rounded-xl font-semibold hover:bg-primary-50 transition shadow">+ New Donation</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Donations', value: stats.total, icon: '🎁', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'Verified', value: stats.verified, icon: '🏆', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}><span className="text-2xl">{s.icon}</span></div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Donations List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Donations</h2>
              <div className="flex gap-2 flex-wrap w-full sm:w-auto">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-32" />
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['All', 'Money', 'Food', 'Clothes', 'Blood', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['All', 'Pending', 'Matched', 'Dispatched', 'Completed'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 dark:text-gray-400 mb-3">No donations found</p>
                <Link to="/donor/create-donation" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">Create your first donation →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(d => (
                  <div key={d.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition flex items-center gap-4">
                    {d.photo_url ? (
                      <img src={d.photo_url} alt={d.title} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl flex-shrink-0">
                        {categoryIcon[d.category] || '📦'}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{d.title}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{d.category} · Qty: {d.quantity} · {new Date(d.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(d.status)}`}>{d.status}</span>
                      {d.isVerified && <span className="text-xs text-green-500">✅ Verified</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Badges earned */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">My Badges</h3>
              {earnedBadges.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-3">Start donating to earn badges!</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {earnedBadges.map(b => (
                    <div key={b.id} title={b.description} className="flex flex-col items-center p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800 cursor-help">
                      <span className="text-2xl mb-1">{b.emoji}</span>
                      <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 leading-tight">{b.name}</span>
                    </div>
                  ))}
                </div>
              )}
              {unearnedBadges.length > 0 && (
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-2">Next to earn:</p>
                  {unearnedBadges.map(b => (
                    <div key={b.id} className="flex items-center gap-2 py-1.5 opacity-50">
                      <span className="text-lg grayscale">{b.emoji}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{b.requirement}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification warning */}
            {!user?.isVerified && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-5">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Not Verified</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">Verify to unlock donation creation.</p>
                <Link to="/verification" className="block text-center py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition">Verify Now</Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { to: '/donor/create-donation', icon: '➕', label: 'New Donation' },
                  { to: '/donor/analytics', icon: '📊', label: 'Analytics' },
                  { to: '/recommendations', icon: '🤖', label: 'AI Recommendations' },
                  { to: '/messages', icon: '💬', label: 'Messages' },
                  { to: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
                  { to: '/profile', icon: '👤', label: 'Edit Profile' },
                ].map(link => (
                  <Link key={link.to} to={link.to} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">
                    <span>{link.icon}</span>{link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
=======
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
              <p className="text-gray-600 mt-2">Manage your donations and help those in need.</p>
              {user?.badges && user.badges.length > 0 && (
                <div className="mt-3">
                  <BadgeDisplay badges={user.badges} showTooltip={true} size="md" />
                </div>
              )}
              {user?.points !== undefined && (
                <div className="mt-2">
                  <span className="text-lg font-semibold text-primary-600">
                    {user.points} Points
                  </span>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Link
                to="/privacy-settings"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Privacy Settings
              </Link>
              <button
                onClick={() => setShowBadgesModal(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                View Badges
              </button>
            </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link
            to="/donor/create-donation"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">➕</div>
            <h3 className="text-xl font-semibold mb-2">Create Donation</h3>
            <p className="text-gray-600">Post a new donation offer</p>
          </Link>

          <Link
            to="/donor/analytics"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">📊</div>
            <h3 className="text-xl font-semibold mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">View your donation statistics</p>
          </Link>

          <Link
            to="/recommendations"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="text-xl font-semibold mb-2">AI Recommendations</h3>
            <p className="text-gray-600">See matched receivers</p>
          </Link>

          <Link
            to="/messages"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="text-3xl mb-2">💬</div>
            <h3 className="text-xl font-semibold mb-2">Messages</h3>
            <p className="text-gray-600">Communicate with receivers</p>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Your Donations</h2>
          {donations.length === 0 ? (
            <p className="text-gray-500">You haven't created any donations yet.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {donation.title}
                        {donation.isVerified && (
                          <span className="ml-2 text-green-600" title="Verified Donation">✅</span>
                        )}
                      </h3>
                      <p className="text-gray-600 mt-1">{donation.description}</p>
                      <div className="mt-2 flex space-x-4 text-sm text-gray-500">
                        <span>Category: {donation.category}</span>
                        <span>Quantity: {donation.quantity}</span>
                        <span className={`px-2 py-1 rounded ${
                          donation.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          donation.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {donation.status}
                        </span>
                        {donation.verificationStatus && (
                          <span className={`px-2 py-1 rounded ${
                            donation.verificationStatus === 'Approved' ? 'bg-green-100 text-green-800' :
                            donation.verificationStatus === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            Verification: {donation.verificationStatus}
                          </span>
                        )}
                      </div>
                      {donation.verificationRemarks && (
                        <p className="mt-2 text-sm text-gray-600">
                          <strong>Remarks:</strong> {donation.verificationRemarks}
                        </p>
                      )}
                      {/* Progress bar for tracking donation lifecycle */}
                      <DonationProgress status={donation.status} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Badges Modal */}
      <ViewBadgesModal
        isOpen={showBadgesModal}
        onClose={() => setShowBadgesModal(false)}
        userBadges={user?.badges || []}
      />
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
    </div>
  );
};

export default DonorDashboard;
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
