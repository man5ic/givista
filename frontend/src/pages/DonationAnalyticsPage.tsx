<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../types/api/apiService';
=======
/**
 * Donation Analytics Dashboard
 * 
 * Analytics page for donors to view their donation statistics and impact.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getDonorAnalytics, DonorAnalytics } from '../types/api/donorAnalyticsApi';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DonationAnalyticsPage = () => {
  const { user } = useAuth();
<<<<<<< HEAD
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/donations/my');
        setDonations(res.data.data || []);
      } catch { setDonations([]); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  // Category breakdown
  const categoryMap: Record<string, number> = {};
  donations.forEach(d => { categoryMap[d.category] = (categoryMap[d.category] || 0) + 1; });
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Monthly trend (last 6 months)
  const monthMap: Record<string, number> = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthMap[d.toLocaleString('default', { month: 'short' })] = 0;
  }
  donations.forEach(d => {
    const month = new Date(d.createdAt).toLocaleString('default', { month: 'short' });
    if (monthMap[month] !== undefined) monthMap[month]++;
  });
  const trendData = Object.entries(monthMap).map(([month, count]) => ({ month, donations: count }));

  // Status breakdown
  const statusMap: Record<string, number> = {};
  donations.forEach(d => { statusMap[d.status] = (statusMap[d.status] || 0) + 1; });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const total = donations.length;
  const completed = donations.filter(d => d.status === 'Completed').length;
  const verified = donations.filter(d => d.isVerified).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-64 bg-white dark:bg-gray-800 rounded-2xl animate-pulse" />)}
=======
  const [analytics, setAnalytics] = useState<DonorAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await getDonorAnalytics();
      setAnalytics(data);
    } catch (error: any) {
      toast.error('Failed to load donation analytics');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-red-600">Failed to load analytics</div>
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
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Donation Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your donation activity at a glance</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Donations', value: total, icon: '🎁', color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Completed', value: completed, icon: '✅', color: 'text-green-600 dark:text-green-400' },
            { label: 'Verified', value: verified, icon: '🏆', color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Points Earned', value: user?.points || 0, icon: '🏅', color: 'text-yellow-600 dark:text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-5">
              <div className="text-3xl mb-2">{s.icon}</div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {donations.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-16 text-center">
            <p className="text-5xl mb-4">📊</p>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No data yet</h2>
            <p className="text-gray-500 dark:text-gray-400">Create some donations to see analytics here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Pie */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">By Category</h2>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Monthly Trend</h2>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="donations" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Status Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">By Status</h2>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Donations Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-700">
                      <th className="pb-2 font-medium">Title</th>
                      <th className="pb-2 font-medium">Category</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-700">
                    {donations.slice(0, 6).map(d => (
                      <tr key={d.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-2 text-gray-900 dark:text-white truncate max-w-[120px]">{d.title}</td>
                        <td className="py-2 text-gray-500 dark:text-gray-400">{d.category}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'}`}>{d.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
=======
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Donation Analytics</h1>
              <p className="text-gray-600 mt-2">Track your donation impact and trends</p>
            </div>
            <Link
              to="/donor/dashboard"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Impact Summary Card */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg shadow-lg p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Your Impact This Month</h2>
          <p className="text-3xl font-bold mb-2">
            You've helped {analytics.summary.peopleHelpedThisMonth} {analytics.summary.peopleHelpedThisMonth === 1 ? 'person' : 'people'} this month! 🎉
          </p>
          <p className="text-blue-100 text-lg">
            Total people helped: {analytics.summary.peopleHelped}
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Donations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.summary.totalDonations}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">All time donations</p>
          </div>

          {/* Total Amount (if Money donations) */}
          {analytics.summary.totalAmount > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ₹{analytics.summary.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">Money donations</p>
            </div>
          )}

          {/* Completed Donations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.summary.completedDonations}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Successfully completed</p>
          </div>

          {/* Donations This Month */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{analytics.summary.donationsThisMonth}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">Donations this month</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Donation Trend */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Monthly Donation Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="count" 
                  stroke="#0ea5e9" 
                  strokeWidth={2} 
                  name="Donations" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Most Donated Categories</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.topCategories}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" name="Donations" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Categories Pie Chart */}
        {analytics.topCategories.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Donation Distribution by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.topCategories}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analytics.topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/donor/create-donation"
              className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition text-center"
            >
              Create New Donation
            </Link>
            <Link
              to="/recommendations"
              className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition text-center"
            >
              View Recommendations
            </Link>
            <Link
              to="/donor/dashboard"
              className="bg-gray-600 text-white p-4 rounded-lg hover:bg-gray-700 transition text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
      </div>
    </div>
  );
};

export default DonationAnalyticsPage;
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
