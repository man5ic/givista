<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../types/api/apiService';

interface PlatformStats {
  totalDonations: number;
  totalDonors: number;
  peopleHelped: number;
  donationsThisMonth: number;
}

const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    const step = Math.ceil(target / (duration / 30));
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev + step >= target) { clearInterval(timer); return target; }
        return prev + step;
      });
    }, 30);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{count.toLocaleString()}</>;
};

const LandingPage = () => {
  const [stats, setStats] = useState<PlatformStats>({ totalDonations: 0, totalDonors: 0, peopleHelped: 0, donationsThisMonth: 0 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats/platform');
        setStats(res.data.data);
        setStatsLoaded(true);
      } catch {
        setStats({ totalDonations: 124, totalDonors: 89, peopleHelped: 210, donationsThisMonth: 18 });
        setStatsLoaded(true);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-teal-600 dark:from-primary-900 dark:via-primary-800 dark:to-teal-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-white/20">🌟 AI-Powered Donation Platform</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">
            Give More.<br />Help More.<br /><span className="text-yellow-300">Impact More.</span>
          </h1>
          <p className="text-lg text-primary-100 mb-10 max-w-2xl mx-auto">
            Givista connects generous donors with people in need using AI-powered matching, gamified rewards, and real-time tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup?role=Donor" className="px-8 py-3.5 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-50 transition shadow-lg">Start Donating →</Link>
            <Link to="/signup?role=Receiver" className="px-8 py-3.5 bg-white/10 border border-white/30 text-white rounded-xl font-bold text-lg hover:bg-white/20 transition">Request Help</Link>
          </div>
        </div>
      </section>

      {/* Impact Counter */}
      <section className="bg-gray-900 dark:bg-black py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Donations Made', value: stats.totalDonations, icon: '🎁', color: 'text-yellow-400' },
            { label: 'Active Donors', value: stats.totalDonors, icon: '❤️', color: 'text-red-400' },
            { label: 'People Helped', value: stats.peopleHelped, icon: '🤝', color: 'text-green-400' },
            { label: 'This Month', value: stats.donationsThisMonth, icon: '📈', color: 'text-blue-400' },
          ].map(stat => (
            <div key={stat.label}>
              <div className="text-3xl mb-1">{stat.icon}</div>
              <div className={`text-3xl sm:text-4xl font-extrabold ${stat.color}`}>
                {statsLoaded ? <AnimatedCounter target={stat.value} /> : '–'}
              </div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">Why Givista?</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-12">Built for impact with powerful technology under the hood</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI Matching', desc: 'Smart algorithms connect donors to the most relevant requests based on category, location, and urgency.' },
              { icon: '🏆', title: 'Gamification', desc: 'Earn points and unlock badges as you donate. Climb the leaderboard and get recognized.' },
              { icon: '🔍', title: 'Fraud Detection', desc: 'Built-in fraud scoring keeps the platform safe, flagging suspicious activity automatically.' },
              { icon: '✅', title: 'KYC Verified', desc: 'All users go through phone, email, or ID verification to ensure trust on both sides.' },
              { icon: '📊', title: 'Real-time Tracking', desc: 'Track donations from creation to completion with live status updates.' },
              { icon: '💬', title: 'Direct Messaging', desc: 'Communicate with donors or receivers directly through the in-app message system.' },
            ].map(f => (
              <div key={f.title} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:shadow-md transition">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 dark:bg-primary-900 py-16 px-4 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to make a difference?</h2>
        <p className="text-primary-100 mb-8 max-w-xl mx-auto">Join thousands of donors and receivers already making an impact on Givista.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup" className="px-8 py-3.5 bg-white text-primary-700 rounded-xl font-bold hover:bg-primary-50 transition">Get Started Free</Link>
          <Link to="/leaderboard" className="px-8 py-3.5 border border-white/40 text-white rounded-xl font-bold hover:bg-white/10 transition">View Leaderboard</Link>
        </div>
      </section>

      <footer className="bg-gray-900 dark:bg-black text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2025 Givista. Made with ❤️ to help communities grow.</p>
      </footer>
=======
/**
 * Landing Page
 * 
 * The home page with overview and call-to-action buttons.
 */

import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Givista
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Connecting donors and receivers to make a difference.
            Help orphanages and individuals by donating money, food, clothes, or blood.
          </p>
          
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4">
              <Link
                to="/signup?role=Donor"
                className="px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
              >
                Become a Donor
              </Link>
              <Link
                to="/signup?role=Receiver"
                className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition"
              >
                Request Help
              </Link>
            </div>
          )}

          {isAuthenticated && (
            <Link
              to="/recommendations"
              className="inline-block px-8 py-3 bg-primary-600 text-white rounded-lg text-lg font-semibold hover:bg-primary-700 transition"
            >
              View Recommendations
            </Link>
          )}
        </div>

        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold mb-2">Donate Money</h3>
            <p className="text-gray-600">
              Support orphanages and individuals with monetary contributions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">Donate Food</h3>
            <p className="text-gray-600">
              Share food supplies with those in need.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">👕</div>
            <h3 className="text-xl font-semibold mb-2">Donate Clothes</h3>
            <p className="text-gray-600">
              Give clothing to help keep people warm and comfortable.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            AI-Powered Matching
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our intelligent recommendation system matches donors with receivers
            based on location, category, and urgency to maximize impact.
          </p>
        </div>
      </div>
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
    </div>
  );
};

export default LandingPage;
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
