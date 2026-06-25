import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, ResponsiveContainer, Legend } from 'recharts';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../types/api/apiService';

const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const DonationAnalyticsPage = () => {
  const { user } = useAuth();
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
        </div>
      </div>
    );
  }

  return (
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
      </div>
    </div>
  );
};

export default DonationAnalyticsPage;
