import { useState, FormEvent, useRef } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import api from '../types/api/apiService';
import { BADGE_DEFINITIONS } from '../utils/badgeDefinitions';

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [photoUrl, setPhotoUrl] = useState(user?.photo_url || '');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!location.trim()) e.location = 'Location is required';
    if (phone && !/^\+?[\d\s\-()]{7,15}$/.test(phone)) e.phone = 'Enter a valid phone number';
    if (photoUrl && !/^https?:\/\/.+/.test(photoUrl)) e.photoUrl = 'Enter a valid URL starting with http(s)://';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.put(`/users/${user.id}`, { name, location, photo_url: photoUrl, phone });
      await refreshUser();
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
    } finally { setLoading(false); }
  };

  const userBadges = user.badges || [];
  const earnedBadges = BADGE_DEFINITIONS.filter(b => userBadges.includes(b.id));
  const unearnedBadges = BADGE_DEFINITIONS.filter(b => !userBadges.includes(b.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900 rounded-2xl p-8 text-white flex items-center gap-6">
          <div className="relative">
            {photoUrl ? (
              <img src={photoUrl} alt={name} className="w-20 h-20 rounded-full object-cover border-4 border-white/30" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
                <span className="text-4xl font-bold">{name?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-primary-100">{user.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm bg-white/20 px-2 py-0.5 rounded-full">{user.role}</span>
              {user.isVerified && <span className="text-sm bg-green-500/30 px-2 py-0.5 rounded-full">✅ Verified</span>}
              <span className="text-sm">🏅 {user.points || 0} pts</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Edit Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.location ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 9876543210"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.phone ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Photo URL</label>
                <input type="url" value={photoUrl} onChange={e => setPhotoUrl(e.target.value)} placeholder="https://example.com/photo.jpg"
                  className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.photoUrl ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
                {errors.photoUrl && <p className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>}
                {photoUrl && !errors.photoUrl && (
                  <img src={photoUrl} alt="Preview" className="mt-2 w-16 h-16 rounded-full object-cover border" onError={() => setErrors(p => ({ ...p, photoUrl: 'Could not load this image URL' }))} />
                )}
              </div>
              <div className="pt-2">
                <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">Email and role cannot be changed for security reasons.</p>
                <button type="submit" disabled={loading}
                  className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 transition">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Badges Panel */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Badges & Achievements</h2>
            {earnedBadges.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">✅ Earned ({earnedBadges.length})</p>
                <div className="space-y-2">
                  {earnedBadges.map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <span className="text-2xl">{b.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{b.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {unearnedBadges.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-400 dark:text-gray-500 mb-3">🔒 Locked ({unearnedBadges.length})</p>
                <div className="space-y-2">
                  {unearnedBadges.map(b => (
                    <div key={b.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg opacity-60">
                      <span className="text-2xl grayscale">{b.emoji}</span>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{b.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{b.requirement}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
