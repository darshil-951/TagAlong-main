import React, { useEffect, useState } from 'react';
import { MapPin, Clock, Package, Edit2 } from 'lucide-react';
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
  // Add other fields as needed
}

// Modal Component
const EditTripModal: React.FC<{ trip: Trip | null, onClose: () => void, onDelete: (id: string) => void }> = ({ trip, onClose, onDelete }) => {
  const [formData, setFormData] = useState<Trip | null>(null);

  useEffect(() => {
    if (trip) {
      setFormData(trip);
    }
  }, [trip]);

  if (!formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'departureDate') {
      const formattedDate = new Date(value).toISOString().split('T')[0]; // Format date to yyyy-MM-dd
      setFormData(prev => prev && { ...prev, [name]: formattedDate });
    } else {
      setFormData(prev => prev && { ...prev, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement save logic here
    try {
      const response = await fetch(getApiEndpoint(`/api/trip/trips/${formData._id}`), { // Updated endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token')}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        // Refresh the list of trips
        onClose();
      }
    } catch (error) {
      console.error('Failed to save trip', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Trip</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source</label>
              <input type="text" name="source" value={formData.source} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Destination</label>
              <input type="text" name="destination" value={formData.destination} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Departure Date</label>
              <input type="date" name="departureDate" value={formData.departureDate} min={new Date().toISOString().split('T')[0]} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input type="number" name="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity Weight (kg)</label>
              <input type="number" name="capacityWeight" value={formData.capacityWeight} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity Volume (m³)</label>
              <input type="number" name="capacityVolume" value={formData.capacityVolume} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full border `border-gray-300 rounded-md"></textarea>
            </div>
            <div className="col-span-2 flex items-center">
              <label className="block text-sm font-medium text-gray-700 mr-2">Accepts Fragile</label>
              <input type="checkbox" name="acceptsFragile" checked={formData.acceptsFragile} onChange={e => setFormData(prev => prev && { ...prev, acceptsFragile: e.target.checked })} className="mt-1" />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => trip && onDelete(trip._id)} // Add null check here
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
            <div>
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-teal-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyTripsPage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

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
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(getApiEndpoint(`/api/trip/trips/${id}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token')}`
        }
      });
      if (response.ok) {
        // Remove the deleted trip from the state
        setTrips(prevTrips => prevTrips.filter(trip => trip._id !== id));
        setSelectedTrip(null);
      } else {
        console.error('Failed to delete trip');
      }
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Trips</h1>
        {loading ? (
          <div>Loading...</div>
        ) : trips.length === 0 ? (
          <div>No trips listed yet.</div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-700">
              Showing {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
            </p>
            {trips.map(trip => (
              <div
                key={trip._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between px-6 py-6"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-2">
                    <span className="text-teal-600 mr-2">
                      <MapPin size={22} />
                    </span>
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {trip.source} to {trip.destination}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-gray-700 dark:text-gray-300 mb-2">
                    <span className="flex items-center">
                      <Clock size={18} className="text-teal-500 mr-1" />
                      {new Date(trip.departureDate).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className="flex items-center">
                      <Package size={18} className="text-teal-500 mr-1" />
                      Up to {trip.capacityWeight}kg, {trip.capacityVolume}m<sup>3</sup>
                    </span>
                    {trip.duration && (
                      <span className="flex items-center">
                        <Clock size={18} className="text-teal-500 mr-1" />
                        Est. travel time: {trip.duration}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    {trip.acceptsFragile && (
                      <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                        Accepts Fragile
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 mb-2">
                    {trip.description}
                  </div>
                </div>
                <div className="flex flex-col items-end min-w-[220px] ml-8">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl font-bold text-teal-600 mr-1">₹{trip.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">per package</span>
                  </div>
                  <button
                    className="flex items-center bg-teal-500 hover:bg-teal-600 text-white font-semibold px-5 py-2 rounded transition-colors mt-2"
                    onClick={() => setSelectedTrip(trip)}
                  >
                    <Edit2 size={18} className="mr-2" />
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {selectedTrip && <EditTripModal trip={selectedTrip} onClose={() => setSelectedTrip(null)} onDelete={handleDelete} />}
    </div>
  );
};

export default MyTripsPage;