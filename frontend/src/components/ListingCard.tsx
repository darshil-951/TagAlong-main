import React from 'react';

import { MapPin, Calendar, Package, Star, Clock, IndianRupee } from 'lucide-react';
import { Listing } from '../types';
import { getAvatarSrc } from '../utils/avatar';


interface ListingCardProps {
  listing: Listing;
  onSendParcel?: () => void; // Add this line
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onSendParcel }) => {

  const user = listing.user || { name: 'Unknown', avatar: '', rating: '-' };

  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const departureDate = formatDate(listing.departureDate);
  const departureTime = formatTime(listing.departureDate);


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <MapPin size={16} className="text-teal-500 flex-shrink-0" />
              <h3 className="text-lg font-semibold ml-1 text-gray-900 dark:text-white">
                {listing.source} to {listing.destination}
              </h3>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Calendar size={16} className="flex-shrink-0 mr-1" />
              <span className="text-sm">{departureDate} at {departureTime}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Package size={16} className="flex-shrink-0 mr-1" />
              <span className="text-sm">
                Up to {listing.capacity.weight}kg, {listing.capacity.volume}m³
              </span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <Clock size={16} className="flex-shrink-0 mr-1" />
              <span className="text-sm">Est. travel time: 5 hours</span>
            </div>

            <div className="flex items-center text-gray-800 dark:text-white font-medium mt-3">
              <IndianRupee size={18} className="text-teal-500 flex-shrink-0" />
              <span className="text-lg">{listing.price}</span>
              <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">per package</span>
            </div>
          </div>

          <div className="ml-4 flex flex-col items-end">
            <div className="flex items-center mb-2">
              <div className="flex items-center bg-yellow-100 text-yellow-800 rounded-full px-2 py-1">
                <Star size={14} className="text-yellow-500" />
                <span className="text-xs font-medium ml-1">{user.rating}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <img
                src={getAvatarSrc(user.avatar, user.name)}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400 mt-1">{user.name}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{listing.description}</p>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div>
            {listing.acceptsFragile ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Accepts Fragile
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                No Fragile Items
              </span>
            )}
          </div>

          <button
            onClick={onSendParcel}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
          >
            Send Parcel
          </button>
        </div>
      </div>

    </div>
  );
};

export default ListingCard;