import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../types/api/apiService';

interface Props {
  donationId: number;
  donorName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const RatingModal = ({ donationId, donorName, onClose, onSubmitted }: Props) => {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setLoading(true);
    try {
      await api.post('/ratings', { donationId, rating, comment });
      toast.success('Rating submitted! Thank you.');
      onSubmitted();
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit rating');
    } finally { setLoading(false); }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Rate This Donation</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">How was your experience with <span className="font-medium text-gray-700 dark:text-gray-300">{donorName}</span>?</p>

        <div className="flex justify-center gap-2 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <button key={star} type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              className="text-4xl transition-transform hover:scale-110 focus:outline-none"
            >
              <span className={(hovered || rating) >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}>★</span>
            </button>
          ))}
        </div>
        {(hovered || rating) > 0 && (
          <p className="text-center text-sm font-medium text-yellow-600 dark:text-yellow-400 mb-4">{labels[hovered || rating]}</p>
        )}

        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Leave a comment (optional)..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4" />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition text-sm">Cancel</button>
          <button onClick={handleSubmit} disabled={loading || rating === 0}
            className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition text-sm font-medium">
            {loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
