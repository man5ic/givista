<<<<<<< HEAD
import { useState, FormEvent, useRef } from 'react';
=======
/**
 * Create Donation Page
 * 
 * Form for donors to create new donations.
 */

import { useState, FormEvent } from 'react';
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { createDonation } from '../types/api/donationApi';

<<<<<<< HEAD
const CATEGORIES = ['Money', 'Food', 'Clothes', 'Blood', 'Other'];

=======
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
const CreateDonationPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Money');
  const [quantity, setQuantity] = useState('');
  const [description, setDescription] = useState('');
<<<<<<< HEAD
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Title is required';
    else if (title.trim().length < 5) e.title = 'Title must be at least 5 characters';
    if (!quantity) e.quantity = 'Quantity is required';
    else if (parseInt(quantity) < 1) e.quantity = 'Quantity must be at least 1';
    if (!description.trim()) e.description = 'Description is required';
    else if (description.trim().length < 10) e.description = 'Description must be at least 10 characters';
    if (photoUrl && !/^https?:\/\/.+/.test(photoUrl)) e.photoUrl = 'Enter a valid image URL starting with http(s)://';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePhotoUrlChange = (url: string) => {
    setPhotoUrl(url);
    setPhotoPreview(url);
    if (errors.photoUrl) setErrors(p => ({ ...p, photoUrl: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result as string;
      setPhotoPreview(result);
      setPhotoUrl(''); // local file preview only, not uploaded
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createDonation({ title, category, quantity: parseInt(quantity), description, photo_url: photoUrl || undefined });
=======
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
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
      toast.success('Donation created successfully!');
      navigate('/donor/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create donation');
<<<<<<< HEAD
    } finally { setLoading(false); }
  };

  const categoryIcons: Record<string, string> = { Money: '💰', Food: '🍱', Clothes: '👗', Blood: '🩸', Other: '📦' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Donation</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Fill in the details below to list your donation.</p>

          {!user?.isVerified && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div>
                <p className="text-yellow-800 dark:text-yellow-300 font-semibold">Verification Required</p>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-1">Verify your profile before creating donations.</p>
              </div>
              <Link to="/verification" className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm ml-4 whitespace-nowrap">Verify Now</Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Clothing Donation for Children"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.title ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category *</label>
              <div className="grid grid-cols-5 gap-2">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => setCategory(cat)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition ${category === cat ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'}`}>
                    <span className="text-2xl mb-1">{categoryIcons[cat]}</span>
                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity / Amount * {category === 'Money' && <span className="text-gray-400">(₹ amount)</span>}
              </label>
              <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder={category === 'Money' ? 'e.g., 500' : 'e.g., 10'}
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.quantity ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
              <textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your donation in detail..."
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none ${errors.description ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Photo (Optional)</label>
              <div className="flex gap-3 mb-3">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 transition">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Upload Image
                </button>
                <span className="text-gray-400 dark:text-gray-500 self-center text-sm">or paste URL</span>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              <input type="url" value={photoUrl} onChange={e => handlePhotoUrlChange(e.target.value)} placeholder="https://example.com/image.jpg"
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.photoUrl ? 'border-red-400' : 'border-gray-300 dark:border-gray-600'}`} />
              {errors.photoUrl && <p className="text-red-500 text-xs mt-1">{errors.photoUrl}</p>}
              {photoPreview && (
                <div className="mt-3 relative inline-block">
                  <img src={photoPreview} alt="Preview" className="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-600 object-cover" onError={() => setPhotoPreview('')} />
                  <button type="button" onClick={() => { setPhotoPreview(''); setPhotoUrl(''); if(fileInputRef.current) fileInputRef.current.value = ''; }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">✕</button>
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading || !user?.isVerified}
                className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 transition">
                {loading ? 'Creating...' : 'Create Donation'}
              </button>
              <button type="button" onClick={() => navigate('/donor/dashboard')}
                className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition">
=======
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
>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
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
<<<<<<< HEAD
=======

>>>>>>> 696cb356b46860bca18eb58e67c68483d5d2ca7c
