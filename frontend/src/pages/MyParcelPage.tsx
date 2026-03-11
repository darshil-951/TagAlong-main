import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiEndpoint } from '../utils/api';
import { getAvatarSrc } from '../utils/avatar';

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
  createdAt?: string;
  // Add other fields as needed
}

const MyParcelPage: React.FC = () => {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const parcelsPerPage = 5;
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


  // Handle sending a message
  const handleChatClick = (parcel: Parcel) => {
    if (!currentUser) return;

    // Determine chat partner (if current user is sender, chat with carrier, and vice versa)
    const partnerId = currentUser._id === parcel.sender._id
      ? parcel.carrier._id
      : parcel.sender._id;

    // Get partner details
    const chatPartner = currentUser._id === parcel.sender._id ? parcel.carrier : parcel.sender;



    // Store the selected chat partner in localStorage for persistence
    localStorage.setItem('tagalong-selected-chat', JSON.stringify({
      partnerId,
      partnerName: chatPartner.name,
      partnerAvatar: getAvatarSrc(chatPartner.avatar, chatPartner.name),
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
    // Use the exact trip price as entered by the lister
    const amount = parcel.trip.price;

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
          <div className="flex justify-center py-12 text-gray-500">Loading your parcels...</div>
        ) : parcels.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
            No parcels listed yet.
          </div>
        ) : (
          <div className="space-y-6">
            {parcels.slice((currentPage - 1) * parcelsPerPage, currentPage * parcelsPerPage).map(parcel => (
              <div key={parcel._id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row p-6 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-gray-800 dark:text-gray-100 font-bold text-xl">
                      {parcel.description || "Parcel Request"}
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide ${parcel.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                        parcel.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                      {parcel.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div>
                      <span className="block font-medium text-gray-400 dark:text-gray-500 text-xs uppercase">Role</span>
                      {currentUser?._id === parcel.sender?._id ? "Sender" : "Carrier"}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-400 dark:text-gray-500 text-xs uppercase">Partner</span>
                      {currentUser?._id === parcel.sender?._id ? parcel.carrier?.name || "Unknown" : parcel.sender?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-400 dark:text-gray-500 text-xs uppercase">Details</span>
                      {parcel.weight}kg • {parcel.category}
                    </div>
                    <div>
                      <span className="block font-medium text-gray-400 dark:text-gray-500 text-xs uppercase">Requested On</span>
                      {parcel.createdAt 
                        ? new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(parcel.createdAt)) 
                        : "Just now"}
                    </div>
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

            {parcels.length > parcelsPerPage && (
              <div className="flex justify-center items-center gap-4 mt-8 pt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page <span className="font-semibold text-gray-900 dark:text-white">{currentPage}</span> of <span className="font-semibold text-gray-900 dark:text-white">{Math.ceil(parcels.length / parcelsPerPage)}</span>
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(Math.ceil(parcels.length / parcelsPerPage), p + 1))}
                  disabled={currentPage === Math.ceil(parcels.length / parcelsPerPage)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcelPage;