import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Package, Edit2, History, CalendarDays, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getApiEndpoint } from '../utils/api';

interface Trip {
  _id: string;
  source: string;
  destination: string;
  departureDate: string;
  capacityWeight: number;
  capacityVolume: number;
  duration?: string;
  price: number;
  description: string;
  acceptsFragile: boolean;
}

// Modal Component
const EditTripModal: React.FC<{ trip: Trip | null, onClose: () => void, onDelete: (id: string) => void }> = ({ trip, onClose, onDelete }) => {
  const [formData, setFormData] = useState<Trip | null>(null);

  useEffect(() => {
    if (trip) setFormData(trip);
  }, [trip]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'departureDate') {
      const formattedDate = new Date(value).toISOString().split('T')[0];
      setFormData(prev => prev && { ...prev, [name]: formattedDate });
    } else {
      setFormData(prev => prev && { ...prev, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(getApiEndpoint(`/api/trip/trips/${formData._id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) onClose();
    } catch (error) {
      console.error('Failed to save trip', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Edit Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Destination</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Departure Date</label>
              <input type="date" name="departureDate" value={formData.departureDate} min={new Date().toISOString().split('T')[0]} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (₹)</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
              <input type="number" name="capacityWeight" value={formData.capacityWeight} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Volume (m³)</label>
              <input type="number" name="capacityVolume" value={formData.capacityVolume} onChange={handleChange} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none"></textarea>
            </div>
            <div className="col-span-2 flex items-center">
              <input type="checkbox" id="fragile" name="acceptsFragile" checked={formData.acceptsFragile} onChange={e => setFormData(prev => prev && { ...prev, acceptsFragile: e.target.checked })} className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded" />
              <label htmlFor="fragile" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Accepts Fragile Items</label>
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <button type="button" onClick={() => trip && onDelete(trip._id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">Delete</button>
            <div className="flex gap-2">
              <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Cancel</button>
              <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">Save</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

type TabType = 'upcoming' | 'history';

const TripCard: React.FC<{ trip: Trip; isPast: boolean; onEdit: (trip: Trip) => void }> = ({ trip, isPast, onEdit }) => {
  const depDate = new Date(trip.departureDate);
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border transition-all hover:shadow-xl ${isPast ? 'border-gray-200 dark:border-gray-700 opacity-80' : 'border-teal-100 dark:border-gray-700'}`}>
      <div className="flex flex-col md:flex-row items-stretch">
        {/* Left accent */}
        <div className={`w-full md:w-1.5 rounded-t-xl md:rounded-l-xl md:rounded-tr-none ${isPast ? 'bg-gray-400' : 'bg-gradient-to-b from-teal-400 to-teal-600'}`} />

        <div className="flex-1 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-teal-500 flex-shrink-0" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {trip.source}
              </span>
              <ChevronRight size={16} className="text-gray-400" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {trip.destination}
              </span>
            </div>
            {isPast && (
              <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2.5 py-1 rounded-full font-medium">Completed</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="flex items-center gap-1">
              <Clock size={15} className="text-teal-500" />
              {depDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Package size={15} className="text-teal-500" />
              {trip.capacityWeight}kg, {trip.capacityVolume}m³
            </span>
            {trip.acceptsFragile && (
              <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2.5 py-0.5 rounded-full font-medium">Fragile OK</span>
            )}
          </div>

          {trip.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{trip.description}</p>
          )}
        </div>

        {/* Right section */}
        <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-2 p-5 md:border-l border-t md:border-t-0 border-gray-100 dark:border-gray-700 md:min-w-[160px]">
          <div className="text-center">
            <span className="text-2xl font-bold text-teal-600">₹{trip.price}</span>
            <span className="block text-xs text-gray-500 dark:text-gray-400">per package</span>
          </div>
          {!isPast && (
            <button
              onClick={() => onEdit(trip)}
              className="flex items-center gap-1.5 bg-teal-500 hover:bg-teal-600 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Edit2 size={14} />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const MyTripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      setLoading(true);
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      const res = await fetch(getApiEndpoint('/api/trip/mytrips'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTrips(data.trips || []);
      }
      setLoading(false);
    };
    fetchTrips();
  }, [selectedTrip]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(getApiEndpoint(`/api/trip/trips/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token')}`
        }
      });
      if (response.ok) {
        setTrips(prev => prev.filter(t => t._id !== id));
        setSelectedTrip(null);
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = trips
    .filter(t => new Date(t.departureDate) >= today)
    .sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());

  const pastTrips = trips
    .filter(t => new Date(t.departureDate) < today)
    .sort((a, b) => new Date(b.departureDate).getTime() - new Date(a.departureDate).getTime());

  const displayTrips = activeTab === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Trips</h1>
          <button
            onClick={() => navigate('/listings/create')}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2.5 rounded-xl font-medium hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/20"
          >
            + List New Trip
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'upcoming'
              ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <CalendarDays size={16} />
            Upcoming
            {upcomingTrips.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'upcoming' ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {upcomingTrips.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-all ${activeTab === 'history'
              ? 'bg-white dark:bg-gray-700 text-teal-600 dark:text-teal-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            <History size={16} />
            History
            {pastTrips.length > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'history' ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {pastTrips.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-500" />
          </div>
        ) : displayTrips.length === 0 ? (
          <div className="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 inline-block mb-4">
              {activeTab === 'upcoming' ? <CalendarDays className="h-12 w-12 text-gray-400" /> : <History className="h-12 w-12 text-gray-400" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeTab === 'upcoming' ? 'No upcoming trips' : 'No trip history'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {activeTab === 'upcoming' ? 'List a new trip to start receiving parcel requests.' : 'Your completed trips will appear here.'}
            </p>
            {activeTab === 'upcoming' && (
              <button onClick={() => navigate('/listings/create')} className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-xl font-medium transition-colors">
                List a Trip
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {displayTrips.length} {displayTrips.length === 1 ? 'trip' : 'trips'}
            </p>
            {displayTrips.map(trip => (
              <TripCard key={trip._id} trip={trip} isPast={activeTab === 'history'} onEdit={setSelectedTrip} />
            ))}
          </div>
        )}
      </div>
      {selectedTrip && <EditTripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} onDelete={handleDelete} />}
    </div>
  );
};

export default MyTripsPage;