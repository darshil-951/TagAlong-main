import React, { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Filter, MapPin, Clock, Package, UserCheck } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import SearchForm, { SearchParams } from '../components/SearchForm';
import { Listing } from '../types';
import { useAuth } from '../context/AuthContext';
import { getApiEndpoint } from '../utils/api';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [allTrips, setAllTrips] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [searchCriteria, setSearchCriteria] = useState<SearchParams>({
    source: searchParams.get('source') || '',
    destination: searchParams.get('destination') || '',
    date: searchParams.get('date') || '',
    isFragile: searchParams.get('isFragile') === 'true',
    weight: Number(searchParams.get('weight')) || 5,
    urgency: (searchParams.get('urgency') as 'normal' | 'express') || 'normal',
    productType: searchParams.get('productType') || 'standard' // Added missing required productType field
  });
  // Add Aadhaar verification state and handlers (copy from ListTripPage.tsx)
  const [showVerification, setShowVerification] = useState(false);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarPhone, setAadhaarPhone] = useState('');
  const [aadhaarName, setAadhaarName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [step, setStep] = useState(1);
  const [parcelDescription, setParcelDescription] = useState("");
  const [parcelWeight, setParcelWeight] = useState(1);
  const [parcelCategory, setParcelCategory] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [ocrError, setOcrError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number | null, number | null]>([null, null]);
  const [sortOption, setSortOption] = useState<'price_asc' | 'price_desc' | 'date_asc' | 'rating'>('date_asc');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [toastType, setToastType] = useState<'otp' | 'request' | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string>("");
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>("");
  const { currentUser } = useAuth();
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(getApiEndpoint('/api/trip/alltrips'));
        if (response.ok) {
          const data = await response.json();
          // Map backend trips to expected Listing structure
          const mappedTrips = data.trips.map((trip: any) => ({
            ...trip,
            capacity: {
              weight: trip.capacityWeight,
              volume: trip.capacityVolume
            }
          }));
          setAllTrips(mappedTrips);
          setFilteredListings(mappedTrips);
        }
      } catch (error) {
        console.error('Failed to fetch trips', error);
      }
    };
    fetchTrips();
  }, []);

  const handleSearch = (params: SearchParams) => {
    setSearchCriteria(params);
    setSearchParams({
      source: params.source,
      destination: params.destination,
      date: params.date,
      ...(params.isFragile && { isFragile: 'true' }),
      ...(params.weight && { weight: params.weight.toString() }),
      ...(params.urgency && { urgency: params.urgency })
    });
    let results = allTrips.filter(listing => {
      // Match source and destination
      const sourceMatch = listing.source.toLowerCase().includes(params.source.toLowerCase());
      const destMatch = listing.destination.toLowerCase().includes(params.destination.toLowerCase());

      // Match date if provided
      let dateMatch = true;
      if (params.date) {
        const searchDate = new Date(params.date).setHours(0, 0, 0, 0);
        const listingDate = new Date(listing.departureDate).setHours(0, 0, 0, 0);
        dateMatch = searchDate === listingDate;
      }

      // Match fragile requirement if needed
      let fragileMatch = true;
      if (params.isFragile) {
        fragileMatch = listing.acceptsFragile;
      }

      // Match weight capacity
      const weightMatch = listing.capacity.weight >= params.weight;

      return sourceMatch && destMatch && dateMatch && fragileMatch && weightMatch;
    });

    // Apply price filter only if min or max is set
    results = results.filter(listing => {
      const minOk = priceRange[0] === null || listing.price >= priceRange[0];
      const maxOk = priceRange[1] === null || listing.price <= priceRange[1];
      return minOk && maxOk;
    });

    // Apply sorting
    switch (sortOption) {
      case 'price_asc':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'date_asc':
        results.sort((a, b) => new Date(a.departureDate).getTime() - new Date(b.departureDate).getTime());
        break;
      case 'rating':
        // This would require user data to sort by rating
        // For now, we'll keep the default
        break;
    }

    setFilteredListings(results);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPrice = Number(e.target.value);
    if (e.target.id === 'min-price') {
      setPriceRange([newPrice, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], newPrice]);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value as 'price_asc' | 'price_desc' | 'date_asc' | 'rating');
  };

  const applyFilters = () => {
    handleSearch(searchCriteria);
  };

  const resetFilters = () => {
    setPriceRange([0, 100]);
    setSortOption('date_asc');
    setSearchCriteria({
      source: '',
      destination: '',
      date: '',
      isFragile: false,
      weight: 5,
      urgency: 'normal',
      productType: 'standard'
    });
    setSearchParams({});
    setFilteredListings(allTrips); // <-- Use allTrips instead of mockListings




    // Replace handleVerifyOtp to check against generatedOtp
    const handleVerifyOtp = async () => {
      setOtpError('');
      setOtpLoading(true);
      if (otp === generatedOtp) {
        setOtpVerified(true);
      } else {
        setOtpError('Invalid OTP. Please try again.');
      }
      setOtpLoading(false);
    };

  };
  const handleCloseToast = () => {
    setShowToast(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };
  async function handleAadhaarFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setOcrError("");
    setAadhaarNumber("");
    setAadhaarPhone("");
    setAadhaarName("");
    setOtpSent(false);
    setOtpVerified(false);
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
      setOcrLoading(true);
      const formData = new FormData();
      formData.append("aadhaar", e.target.files[0]);
      try {
        const res = await fetch(getApiEndpoint("/api/trip/ocr/aadhaar"), { method: "POST", body: formData });
        const data = await res.json();
        if (data.aadhaarNumber) {
          setAadhaarNumber(data.aadhaarNumber);
          if (data.phone) setAadhaarPhone(data.phone);
          if (data.name) setAadhaarName(data.name);
        } else {
          setOcrError("Could not extract Aadhaar details. Please upload a clear image or PDF.");
        }
      } catch {
        setOcrError("OCR failed. Please try again.");
      }
      setOcrLoading(false);
    }
  }

  function getAuthenticatedUserId() {

    return currentUser ? currentUser.id : null;
  }
  function handleVerifyOtp(): void {
    setOtpError('');
    setOtpLoading(true);
    if (otp === generatedOtp) {
      setOtpVerified(true);
    } else {
      setOtpError('Invalid OTP. Please try again.');
    }
    setOtpLoading(false);
  }
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    console.log('parcelDescription:', parcelDescription);
    console.log('parcelWeight:', parcelWeight);
    console.log('parcelCategory:', parcelCategory);
    console.log('selectedTripId:', selectedTripId);
    console.log('selectedCarrierId:', selectedCarrierId);
    setToastType('request');
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 3000);

    // Validate required fields
    if (!parcelDescription || !parcelWeight || !parcelCategory || !selectedTripId || !selectedCarrierId) {
      alert('Please fill all required fields.');
      return;
    }

    async function sendRequest() {
      const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
      if (!token) {
        alert('You must be logged in to send a parcel request.');
        return;
      }
      try {
        const response = await fetch(getApiEndpoint('/api/parcel/request'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            description: parcelDescription,
            weight: parcelWeight,
            category: parcelCategory,
            trip: selectedTripId,
            carrier: selectedCarrierId,
            sender: getAuthenticatedUserId() // Ensure sender ID is included
          })
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Request failed');
        }
        const parcelData = await response.json();
        setSelectedTripId(parcelData.trip);
        setSelectedCarrierId(parcelData.carrier);
        navigate('/myparcel');
      } catch (error) {
        if (error instanceof Error) {
          alert(error.message);
        } else {
          alert('An unexpected error occurred');
        }
      }
    }

    sendRequest().then(() => {
      navigate('/myparcel');
    });
  }
  function handleSendOtp(): void {
    setOtpError("");
    setOtpLoading(true);
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setOtpLoading(false);
    setToastType('otp');
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 10000);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Find Available Trips</h1>
          <SearchForm onSearch={handleSearch} className="bg-white shadow rounded-lg" initialValues={searchCriteria} />
        </div>

        <div className="lg:flex lg:gap-8">
          {/* Toast Notification */}

          {showToast && toastType === 'otp' && generatedOtp && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50">
              OTP sent: <span className="font-bold">{generatedOtp}</span>
            </div>
          )}
          {showToast && toastType === 'request' && (
            <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow">
              Request sent
            </div>
          )}
          {/* ... existing code ... */}
          {/* Sidebar Filters for Desktop */}
          <div className="hidden lg:block lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">₹{priceRange[0]}</span>
                    <span className="text-gray-600 dark:text-gray-400">₹{priceRange[1]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="min-price" className="block text-sm text-gray-600 dark:text-gray-400">Min</label>
                      <input
                        type="number"
                        id="min-price"
                        min="0"
                        value={priceRange[0] ?? ''}
                        onChange={e => setPriceRange([e.target.value ? Number(e.target.value) : null, priceRange[1]])}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="max-price" className="block text-sm text-gray-600 dark:text-gray-400">Max</label>
                      <input
                        type="number"
                        id="max-price"
                        min={priceRange[0] ?? 0}
                        value={priceRange[1] ?? ''}
                        onChange={e => setPriceRange([priceRange[0], e.target.value ? Number(e.target.value) : null])}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sort By</h3>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="date_asc">Departure: Earliest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Rating: High to Low</option>
                </select>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={applyFilters}
                  className="w-full bg-teal-500 text-white font-medium py-2 rounded-md hover:bg-teal-600 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={resetFilters}
                  className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={toggleFilters}
              className="flex items-center justify-center w-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Price Range</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">₹{priceRange[0]}</span>
                      <span className="text-gray-600 dark:text-gray-400">₹{priceRange[1]}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="mobile-min-price" className="block text-sm text-gray-600 dark:text-gray-400">Min</label>
                        <input
                          type="number"
                          id="mobile-min-price"
                          min="0"
                          max={priceRange[1] ?? ''}
                          value={priceRange[0] ?? ''}
                          onChange={handlePriceChange}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                      <div>
                        <label htmlFor="mobile-max-price" className="block text-sm text-gray-600 dark:text-gray-400">Max</label>
                        <input
                          type="number"
                          id="mobile-max-price"
                          min={priceRange[0] ?? 0}
                          value={priceRange[1] ?? ''}
                          onChange={e => setPriceRange([priceRange[0], e.target.value ? Number(e.target.value) : null])}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sort By</h3>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="date_asc">Departure: Earliest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating">Rating: High to Low</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-3">
                  <button
                    onClick={applyFilters}
                    className="w-full bg-teal-500 text-white font-medium py-2 rounded-md hover:bg-teal-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={resetFilters}
                    className="w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {searchCriteria.source && searchCriteria.destination && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center">
                    <MapPin size={18} className="text-teal-500 mr-1" />
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{searchCriteria.source}</span>
                      <span className="mx-2">→</span>
                      <span className="font-medium">{searchCriteria.destination}</span>
                    </span>
                  </div>

                  {searchCriteria.date && (
                    <div className="flex items-center">
                      <Clock size={18} className="text-teal-500 mr-1" />
                      <span className="text-gray-700">
                        {new Date(searchCriteria.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  )}

                  {searchCriteria.weight > 0 && (
                    <div className="flex items-center">
                      <Package size={18} className="text-teal-500 mr-1" />
                      <span className="text-gray-700">{searchCriteria.weight}kg</span>
                    </div>
                  )}

                  {searchCriteria.isFragile && (
                    <div className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded-full">
                      Fragile
                    </div>
                  )}

                  {searchCriteria.urgency === 'express' && (
                    <div className="bg-orange-100 text-orange-800 text-sm px-2 py-1 rounded-full">
                      Express
                    </div>
                  )}
                </div>
              </div>
            )}

            {filteredListings.length > 0 ? (
              <div className="space-y-6">
                <p className="text-gray-700">
                  Showing {filteredListings.length} {filteredListings.length === 1 ? 'trip' : 'trips'}
                </p>

                {filteredListings.map(listing => (
                  <ListingCard
                    key={String(listing._id)}
                    listing={listing}
                    onSendParcel={() => {
                      const user = listing.user || { _id: '' };
                      setShowVerification(true);
                      setSelectedTripId(String(listing._id));
                      setSelectedCarrierId(String(user._id));
                    }}
                  />
                ))}

                {showVerification && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                    <form onSubmit={handleSubmit}
                      className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg pt-10 pb-8 px-8 w-full max-w-2xl mx-auto"
                    >
                      <button
                        type="button"
                        onClick={() => setShowVerification(false)}
                        className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-700 focus:outline-none z-10"
                        aria-label="Close"
                      >
                        ×
                      </button>
                      {/* Step 1: Aadhaar OTP Verification */}
                      {step === 1 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4 flex items-center">
                            Aadhaar Verification (with OTP)
                          </h2>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                              Upload Aadhaar Image (JPG/PNG)
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAadhaarFileChange}
                              className="w-full"
                              required
                              disabled={ocrLoading}
                            />
                            {ocrLoading && <div className="text-teal-600 mt-2">Extracting details...</div>}
                            {ocrError && <div className="text-red-600 mt-2">{ocrError}</div>}
                          </div>
                          {aadhaarNumber && aadhaarPhone && /^\d{12}$/.test(aadhaarNumber) && /^\d{10}$/.test(aadhaarPhone) && (
                            <div className="flex flex-col items-center mb-4">
                              <svg className="w-16 h-16 text-green-500 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="white" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13l3 3 7-7" />
                              </svg>
                              <div className="text-green-700 font-bold text-lg mt-2">User Verified!</div>
                              <div className="text-gray-600 mt-1 mb-2">Please enter your phone number or email for OTP verification.</div>
                              <input
                                type="text"
                                value={aadhaarPhone}
                                onChange={e => setAadhaarPhone(e.target.value)}
                                className="border px-4 py-2 rounded mt-2 w-64 text-center dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                placeholder="Enter phone number or email"
                                required
                              />
                              {!otpSent && (
                                <button
                                  type="button"
                                  className="bg-teal-500 text-white px-6 py-2 rounded-md mt-3"
                                  onClick={handleSendOtp}
                                  disabled={otpLoading || (!/^\d{10}$/.test(aadhaarPhone) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(aadhaarPhone))}
                                >
                                  {otpLoading ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                              )}
                              {otpSent && !otpVerified && (
                                <div className="mt-4">
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Enter OTP sent to {aadhaarPhone}
                                  </label>
                                  <input
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:text-white"
                                    maxLength={6}
                                    required
                                  />
                                  <button
                                    type="button"
                                    className="bg-teal-600 text-white px-6 py-2 rounded-md mt-2"
                                    onClick={handleVerifyOtp}
                                    disabled={otpLoading || otp.length !== 6}
                                  >
                                    {otpLoading ? 'Verifying...' : 'Verify OTP'}
                                  </button>
                                  {otpError && <div className="text-red-600 mt-2">{otpError}</div>}
                                </div>
                              )}
                              {otpVerified && (
                                <div className="text-green-600 mt-4 font-semibold">
                                  OTP Verified! Aadhaar authentication complete.
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={handleNext}
                              className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors font-semibold"
                              disabled={!otpVerified}
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      )}
                      {/* Step 2: Parcel Details */}
                      {step === 2 && (
                        <div>
                          <h2 className="text-xl font-semibold mb-4 flex items-center">Parcel Details</h2>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parcel Description</label>
                            <input
                              type="text"
                              value={parcelDescription}
                              onChange={e => setParcelDescription(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              placeholder="Describe your parcel"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight (kg)</label>
                            <input
                              type="number"
                              value={parcelWeight}
                              onChange={e => setParcelWeight(Number(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              min={0.1}
                              step={0.1}
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                              value={parcelCategory}
                              onChange={e => setParcelCategory(e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                              required
                            >
                              <option value="">Select category</option>
                              <option value="Electronics">Electronics</option>
                              <option value="Clothes">Clothes</option>
                              <option value="Documents">Documents</option>
                              <option value="Food">Food</option>
                              <option value="Furniture">Furniture</option>
                              <option value="Fragile Items">Fragile Items</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div className="flex justify-between">
                            <button
                              type="button"
                              onClick={handleBack}
                              className="bg-gray-300 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-400 transition-colors font-semibold"
                            >
                              Back
                            </button>
                            <button
                              type="submit"
                              className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors font-semibold"
                            >
                              Submit Parcel Request
                            </button>
                          </div>
                        </div>
                      )}

                    </form>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
                  <MapPin size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No trips found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We couldn't find any trips matching your search criteria. Try adjusting your filters or search for different locations.
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-teal-500 hover:bg-teal-600"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
