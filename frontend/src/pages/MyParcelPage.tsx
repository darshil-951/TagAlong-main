import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Message, User } from '../types';
import { getApiEndpoint, getUploadUrl } from '../utils/api';

interface Parcel {
  _id: string;
  status: 'pending' | 'accepted' | 'rejected';
  description: string;
  weight: number;
  category: string;
  trip: any;
  carrier: any;
  sender: any;
  paymentStatus?: 'unpaid' | 'processing' | 'paid';
  price?: number;
  // Add other fields as needed
}

const MyParcelPage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatPartnerId, setChatPartnerId] = useState<string>('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Add this function to handle status updates
  const handleUpdateStatus = async (parcelId: string, status: 'accepted' | 'rejected') => {
    const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
    const res = await fetch(getApiEndpoint(`/api/parcel/request/${parcelId}/status`), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setParcels(prev => prev.map(p => p._id === parcelId ? { ...p, status } : p));
    }
  };

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const res = await fetch(getApiEndpoint('/api/parcel/myparcels'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParcels(data); // Backend returns an array, not { parcels: [...] }
      }
      setLoading(false);
    };
    fetchParcels();
  }, []);

  // Handle opening chat
  const handleOpenChat = async (parcel: Parcel) => {
    if (!currentUser) return;

    setSelectedParcel(parcel);

    // Determine chat partner (if current user is sender, chat with carrier, and vice versa)
    const partnerId = currentUser._id === parcel.sender._id
      ? parcel.carrier._id
      : parcel.sender._id;

    setChatPartnerId(partnerId);

    try {
      // Fetch chat history
      setShowChat(true);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
    }
  };

  // Handle sending a message
  const handleChatClick = (parcel: Parcel) => {
    if (!currentUser) return;

    // Determine chat partner (if current user is sender, chat with carrier, and vice versa)
    const partnerId = currentUser._id === parcel.sender._id
      ? parcel.carrier._id
      : parcel.sender._id;

    // Get partner details
    const chatPartner = currentUser._id === parcel.sender._id ? parcel.carrier : parcel.sender;

    // Create a proper User object for the chat partner
    const chatPartnerUser: User = {
      _id: partnerId,
      id: partnerId,
      name: chatPartner.name,
      avatar: chatPartner.avatar || getUploadUrl(`/uploads/avatars/${partnerId}.jpg`),
      verificationStatus: chatPartner.verificationStatus,
      onlineStatus: 'online',
      lastSeen: new Date().toISOString(),
      // Add missing required properties
      role: 'user',
      createdAt: new Date().toISOString(),
      email: '',
      phone: '',
      isVerified: false,
      verificationDocuments: [],
      rating: 0,
      reviews: []
    };


    // Store the selected chat partner in localStorage for persistence
    localStorage.setItem('tagalong-selected-chat', JSON.stringify({
      partnerId,
      partnerName: chatPartner.name,
      partnerAvatar: chatPartner.avatar || getUploadUrl(`/uploads/avatars/${partnerId}.jpg`),
      partnerVerificationStatus: chatPartner.verificationStatus || 'unverified',
      partnerOnlineStatus: 'offline',
      partnerLastSeen: new Date().toISOString()
    }));

    // Navigate to the messages page
    navigate('/messages');
  };

  // Add this function to handle payment
  const handlePaymentClick = (parcel: Parcel) => {
    // Calculate the amount based on the parcel details
    // For this example, we'll use a fixed amount of 500
    const amount = parcel.price || parcel.trip.price * parcel.weight;

    // Navigate to the payment page with the parcel ID and amount
    navigate('/payment', {
      state: {
        parcelId: parcel._id,
        amount: amount
      }
    });
  };

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const res = await fetch(getApiEndpoint('/api/parcel/myparcels'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setParcels(data); // Backend returns an array, not { parcels: [...] }
      }
      setLoading(false);
    };
    fetchParcels();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Parcels</h1>
        {loading ? (
          <div>Loading...</div>
        ) : parcels.length === 0 ? (
          <div>No parcels listed yet.</div>
        ) : (
          <div className="space-y-6">
            {parcels.map(parcel => (
              <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-6 py-6 mb-4 border border-gray-200">
                <div className="flex-1 min-w-0">
                  <div className="text-gray-700 dark:text-gray-300 mb-2 font-semibold text-lg">
                    {parcel.description}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${parcel.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        parcel.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {parcel.status.charAt(0).toUpperCase() + parcel.status.slice(1)}
                    </span>
                  </div>
                  {/* Accept/Decline for carrier only if pending */}
                  {parcel.status === 'pending' && currentUser && parcel.carrier && parcel.carrier._id === currentUser._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                        onClick={() => handleUpdateStatus(parcel._id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                        onClick={() => handleUpdateStatus(parcel._id, 'rejected')}
                      >
                        Decline
                      </button>
                    </div>
                  )}
                  {/* Chat button for accepted parcels */}
                  {(parcel.status === 'accepted') && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded transition-colors mt-2 shadow"
                        onClick={() => handleChatClick(parcel)}
                      >
                        Chat
                      </button>

                      {/* Only show payment button to the sender if not paid */}
                      {currentUser && currentUser._id === parcel.sender._id && (
                        parcel.paymentStatus === 'paid' ? (
                          <span className="flex items-center bg-green-100 text-green-800 font-semibold px-5 py-2 rounded mt-2">
                            Payment Completed
                          </span>
                        ) : (
                          <button
                            className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded transition-colors mt-2 shadow"
                            onClick={() => handlePaymentClick(parcel)}
                          >
                            Make Payment
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcelPage;