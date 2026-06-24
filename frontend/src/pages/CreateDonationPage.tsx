/**
 * Create Donation Page
 * 
 * Form for donors to create new donations.
 */

import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { createDonation } from '../types/api/donationApi';

const CreateDonationPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Money');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
  const [photo_url, setPhoto_url] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createDonation({
        title,
        category,
        quantity: parseInt(quantity),
        description,
        photo_url: photo_url || undefined,
      });
      toast.success('Donation created successfully!');
      navigate('/donor/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create Donation</h1>
          
          {!user?.isVerified && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-800 font-semibold">Profile Verification Required</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    You must verify your profile before creating donations. This ensures trust and authenticity on the platform.
                  </p>
                </div>
                <Link
                  to="/verification"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 text-sm whitespace-nowrap ml-4"
                >
                  Verify Profile
                </Link>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                id="title"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Clothing Donation for Children"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Money">Money</option>
                <option value="Food">Food</option>
                <option value="Clothes">Clothes</option>
                <option value="Blood">Blood</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Quantity/Amount *
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., 50 or 500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your donation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="photo_url" className="block text-sm font-medium text-gray-700">
                Photo URL (optional)
              </label>
              <input
                id="photo_url"
                type="url"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/photo.jpg"
                value={photo_url}
                onChange={(e) => setPhoto_url(e.target.value)}
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading || !user?.isVerified}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/donor/dashboard')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDonationPage;

