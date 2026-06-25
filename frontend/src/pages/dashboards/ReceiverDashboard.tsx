<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { BADGE_DEFINITIONS } from '../../utils/badgeDefinitions';
import api from '../../types/api/apiService';

interface ReceiverStats {
  totalRequests: number;
  activeRequests: number;
  fulfilledRequests: number;
  pendingRequests: number;
}

interface DonationRequest {
  id: number;
  title: string;
  category: string;
  quantity: number;
  status: string;
  urgency: string;
  createdAt: string;
}

const ReceiverDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<ReceiverStats>({ totalRequests: 0, activeRequests: 0, fulfilledRequests: 0, pendingRequests: 0 });
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/requests/my');
        const data: DonationRequest[] = res.data.data || [];
        setRequests(data);
        setStats({
          totalRequests: data.length,
          activeRequests: data.filter(r => ['Pending', 'Matched'].includes(r.status)).length,
          fulfilledRequests: data.filter(r => r.status === 'Fulfilled').length,
          pendingRequests: data.filter(r => r.status === 'Pending').length,
        });
      } catch (err) {
        console.error('Failed to fetch requests:', err);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = requests.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const userBadges = user?.badges || [];
  const earnedBadges = BADGE_DEFINITIONS.filter(b => userBadges.includes(b.id));

  const statusColor = (s: string) => {
    if (s === 'Fulfilled') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
    if (s === 'Matched') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
    if (s === 'Pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
    return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
  };

  const urgencyColor = (u: string) => {
    if (u === 'Critical') return 'text-red-600 dark:text-red-400';
    if (u === 'High') return 'text-orange-500 dark:text-orange-400';
    if (u === 'Medium') return 'text-yellow-600 dark:text-yellow-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const categoryIcon: Record<string, string> = { Money: '💰', Food: '🍱', Clothes: '👗', Blood: '🩸', Other: '📦' };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />
          ))}
=======
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
        <div className="bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-800 dark:to-teal-800 rounded-2xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {user?.photo_url ? (
              <img src={user.photo_url} alt={user.name} className="w-16 h-16 rounded-full object-cover border-4 border-white/30" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">Welcome, {user?.name?.split(' ')[0]}!</h1>
              <p className="text-green-100">Receiver Dashboard</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {user?.isVerified && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">✅ Verified</span>}
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">🏅 {user?.points || 0} pts</span>
                {earnedBadges.length > 0 && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">🏆 {earnedBadges.length} badges</span>}
              </div>
            </div>
          </div>
          <Link to="/receiver/create-request"
            className="px-6 py-3 bg-white text-green-700 rounded-xl font-semibold hover:bg-green-50 transition shadow">
            + New Request
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Requests', value: stats.totalRequests, icon: '📋', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { label: 'Active', value: stats.activeRequests, icon: '⏳', color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
            { label: 'Fulfilled', value: stats.fulfilledRequests, icon: '✅', color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
            { label: 'Points Earned', value: user?.points || 0, icon: '🏅', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
          ].map(stat => (
            <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-3`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Requests</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full sm:w-40" />
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500">
                  {['All', 'Pending', 'Matched', 'Fulfilled', 'Expired'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 dark:text-gray-400">No requests found</p>
                <Link to="/receiver/create-request" className="mt-3 inline-block text-primary-600 dark:text-primary-400 hover:underline text-sm">Create your first request →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(r => (
                  <div key={r.id} className="border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xl flex-shrink-0">{categoryIcon[r.category] || '📦'}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{r.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Qty: {r.quantity} · {new Date(r.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(r.status)}`}>{r.status}</span>
                        {r.urgency && <span className={`text-xs font-medium ${urgencyColor(r.urgency)}`}>{r.urgency}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Badges */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">My Badges</h3>
              {earnedBadges.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">Complete activities to earn badges!</p>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {earnedBadges.map(b => (
                    <div key={b.id} title={b.description} className="flex flex-col items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 cursor-help">
                      <span className="text-2xl mb-1">{b.emoji}</span>
                      <span className="text-xs font-medium text-center text-gray-700 dark:text-gray-300 leading-tight">{b.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Verification */}
            {!user?.isVerified && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-2xl p-5">
                <p className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">⚠️ Not Verified</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-3">Verify your account to access all features.</p>
                <Link to="/verification" className="block text-center py-2 bg-yellow-600 text-white rounded-lg text-sm hover:bg-yellow-700 transition">Verify Now</Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { to: '/receiver/create-request', icon: '➕', label: 'New Request' },
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
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
        </div>
      </div>
    </div>
  );
};

export default ReceiverDashboard;
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
