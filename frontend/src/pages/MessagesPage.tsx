/**
 * Messages Page
 * 
 * Simple messaging interface for communication between users.
 */

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { getMessages, sendMessage } from '../types/api/messageApi';
import { IMessage } from '../types/api/types';

const MessagesPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdParam = searchParams.get('userId');
    if (userIdParam) {
      setSelectedUserId(parseInt(userIdParam));
    }
    fetchMessages();
  }, [searchParams]);

  const fetchMessages = async () => {
    try {
      const userIdParam = searchParams.get('userId');
      const data = await getMessages(userIdParam ? parseInt(userIdParam) : undefined);
      setMessages(data);
    } catch (error: any) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserId) {
      toast.error('Please enter a message and select a recipient');
      return;
    }

    try {
      await sendMessage({
        receiverId: selectedUserId,
        text: newMessage,
      });
      setNewMessage('');
      fetchMessages();
      toast.success('Message sent!');
    } catch (error: any) {
      toast.error('Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-xl">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

          {selectedUserId && (
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                To: <span className="font-semibold">User #{selectedUserId}</span>
              </div>
              <button
                className="text-xs text-primary-600 hover:text-primary-700"
                onClick={() => setSelectedUserId(null)}
              >
                Change recipient
              </button>
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No messages yet. Start a conversation!
              </p>
            ) : (
              messages.map((message) => {
                const isSent = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isSent
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${isSent ? 'text-primary-100' : 'text-gray-500'}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            {!selectedUserId && (
              <input
                type="number"
                placeholder="Recipient ID"
                className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={selectedUserId || ''}
                onChange={(e) => setSelectedUserId(e.target.value ? parseInt(e.target.value) : null)}
              />
            )}
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              type="submit"
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;

