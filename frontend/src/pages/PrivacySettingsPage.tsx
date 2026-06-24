/**
 * Privacy Settings Page
 * 
 * Allows users to manage their privacy preferences.
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getPrivacySettings, updatePrivacySettings, PrivacySettings } from '../types/api/privacyApi';

const PrivacySettingsPage = () => {
  const { user, refreshUser } = useAuth();
  const [settings, setSettings] = useState<PrivacySettings>({
    showEmail: true,
    showPhone: true,
    showLocation: true,
    allowLeaderboardVisibility: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getPrivacySettings();
      setSettings(data);
    } catch (error: any) {
      toast.error('Failed to load privacy settings');
      console.error('Error fetching privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof PrivacySettings) => {
    try {
      setSaving(true);
      const newSettings = {
        ...settings,
        [key]: !settings[key],
      };
      
      const updated = await updatePrivacySettings({ [key]: newSettings[key] });
      setSettings(updated);
      
      // Refresh user data to reflect changes
      await refreshUser();
      
      toast.success('Privacy settings updated successfully');
    } catch (error: any) {
      toast.error(`Failed to update privacy setting: ${error.message || 'Unknown error'}`);
      console.error('Error updating privacy setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const updated = await updatePrivacySettings(settings);
      setSettings(updated);
      
      // Refresh user data to reflect changes
      await refreshUser();
      
      toast.success('Privacy settings saved successfully');
    } catch (error: any) {
      toast.error(`Failed to save privacy settings: ${error.message || 'Unknown error'}`);
      console.error('Error saving privacy settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading privacy settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Settings</h1>
              <p className="text-gray-600 mt-2">Control how your information is displayed across Givista</p>
            </div>
            <Link
              to={user?.role === 'Donor' ? '/donor/dashboard' : user?.role === 'Receiver' ? '/receiver/dashboard' : '/admin/dashboard'}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Privacy Settings Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Data Visibility</h2>
          <p className="text-gray-600 mb-6">
            Choose what information is visible to other users on the platform.
          </p>

          <div className="space-y-6">
            {/* Show Email Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Show Email Address</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Allow other users to see your email address in your profile and public listings
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showEmail}
                  onChange={() => handleToggle('showEmail')}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Show Phone Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Show Phone Number</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Allow other users to see your phone number in your profile
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showPhone}
                  onChange={() => handleToggle('showPhone')}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Show Location Toggle */}
            <div className="flex items-center justify-between py-4 border-b border-gray-200">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Show Location</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Allow other users to see your location in your profile and donation listings
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.showLocation}
                  onChange={() => handleToggle('showLocation')}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            {/* Leaderboard Visibility Toggle */}
            <div className="flex items-center justify-between py-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Show on Leaderboard</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Allow your profile to appear on the public leaderboard. When disabled, you won't be visible in rankings.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allowLeaderboardVisibility}
                  onChange={() => handleToggle('allowLeaderboardVisibility')}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Privacy Information</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Your privacy settings control how your information appears to other users. 
                  Changes take effect immediately and apply across all public views of your profile.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button (optional - settings save automatically on toggle) */}
        {saving && (
          <div className="text-center text-gray-600">
            Saving changes...
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivacySettingsPage;

