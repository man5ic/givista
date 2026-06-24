import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { IDonation } from '../types/api/types';
import { getFlaggedDonations, markDonationSafe, confirmDonationFraud } from '../types/api/donationApi';

const AdminFraudMonitor = () => {
  const [items, setItems] = useState<IDonation[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await getFlaggedDonations();
      setItems(data);
    } catch (e) {
      toast.error('Failed to load flagged donations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { refresh(); }, []);

  const onMarkSafe = async (id: number) => {
    try {
      await markDonationSafe(id);
      toast.success('Marked as safe');
      refresh();
    } catch { toast.error('Action failed'); }
  };

  const onConfirmFraud = async (id: number) => {
    try {
      await confirmDonationFraud(id);
      toast.success('Marked as fraud');
      refresh();
    } catch { toast.error('Action failed'); }
  };

  if (loading) return (
    <div className="bg-white rounded-lg shadow-md p-6">Loading flagged donations...</div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Fraud Monitor</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No flagged donations right now.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {items.map(d => (
            <div key={d.id} className="border rounded-lg p-4">
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">{d.title}</div>
                  <div className="text-sm text-gray-600">Category: {d.category} • Qty: {d.quantity}</div>
                  <div className="text-sm text-gray-600">Fraud Score: {(d.fraudScore ?? 0).toFixed(2)}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => onMarkSafe(d.id)} className="px-3 py-1 text-sm bg-green-600 text-white rounded">Verify Safe</button>
                  <button onClick={() => onConfirmFraud(d.id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded">Confirm Fraud</button>
                </div>
              </div>
              <p className="text-sm mt-2 text-gray-700">{d.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFraudMonitor;


