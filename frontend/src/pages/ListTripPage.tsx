import React, { useState, useEffect } from 'react';
import LocationAutocomplete from '../components/LocationAutocomplete';
import { Calendar, Truck, PackageCheck, Box, Upload, UserCheck, IndianRupee, Timer, FileText, Search } from 'lucide-react';
import { getApiEndpoint } from '../utils/api';
const transportModes = [
  { value: 'car', label: 'Car' },
  { value: 'bike', label: 'Bike' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'flight', label: 'Flight' },
  { value: 'other', label: 'Other' }
];

const categories = [
  'Electronics',
  'Clothes',
  'Documents',
  'Food',
  'Furniture',
  'Fragile Items',
  'Other'
];

const ListTripPage: React.FC = () => {
  const [step, setStep] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

  // Trip Details
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [duration, setDuration] = useState('');
  const [transport, setTransport] = useState('');
  const [capacityWeight, setCapacityWeight] = useState<number>(5);
  const [capacityVolume, setCapacityVolume] = useState<number>(1);
  const [acceptsFragile, setAcceptsFragile] = useState(false);
  const [acceptedCategories, setAcceptedCategories] = useState<string[]>([]);
  const [identificationPhoto, setIdentificationPhoto] = useState<File | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarPhone, setAadhaarPhone] = useState('');
  const [aadhaarName, setAadhaarName] = useState('');
  // Add this line:
  const [description, setDescription] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [ocrError, setOcrError] = useState('');

  // Add this line to fix the error:
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  // Aadhaar OCR handler
  const handleAadhaarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setOcrError('');
    setAadhaarNumber('');
    setAadhaarPhone('');
    setAadhaarName('');
    setOtpSent(false);
    setOtpVerified(false);
    if (e.target.files && e.target.files[0]) {
      setAadhaarFile(e.target.files[0]);
      setOcrLoading(true);
      const formData = new FormData();
      formData.append('aadhaar', e.target.files[0]);
      try {
        const res = await fetch(getApiEndpoint('/api/trip/ocr/aadhaar'), { method: 'POST', body: formData });
        const data = await res.json();
        if (data.aadhaarNumber) {
          setAadhaarNumber(data.aadhaarNumber);
          if (data.phone) setAadhaarPhone(data.phone);
          if (data.name) setAadhaarName(data.name);
        } else {
          setOcrError('Could not extract Aadhaar details. Please upload a clear image or PDF.');
        }
      } catch {
        setOcrError('OCR failed. Please try again.');
      }
      setOcrLoading(false);
    }
  };

  // Replace handleSendOtp with a local OTP generator
  const handleSendOtp = async () => {
    setOtpError('');
    setOtpLoading(true);
    // Simulate OTP generation and "sending"
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    setOtpSent(true);
    setOtpLoading(false);
    setShowToast(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setShowToast(false), 10000); // 10 seconds
  };

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
  const handleCloseToast = () => {
    setShowToast(false);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
  };

  // Handle category selection
  const toggleCategory = (cat: string) => {
    setAcceptedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Handle file inputs
  const handleFileChange = (setter: (f: File | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  // Step navigation
  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('tagalong-token') || sessionStorage.getItem('tagalong-token');
    const tripData = {
      source,
      destination,
      departureDate,
      arrivalDate: '', // or your value
      transport,
      vehicle: {
        type: transport,
        model: '', // collect from user if needed
        registrationNumber: '', // collect from user if needed
        verified: false
      },
      capacityWeight,
      capacityVolume,
      acceptsFragile,
      acceptedCategories,
      price,
      identificationPhoto: '', // handle upload if needed
      description,
      images: []
    };

    const res = await fetch(getApiEndpoint('/api/trip/trips'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(tripData)
    });

    if (res.ok) {
      alert('Trip listed successfully!');
      // Optionally redirect or reset form
    } else {
      const data = await res.json();
      alert('Failed to list trip: ' + (data.error || 'Unknown error'));
    }
  };

  return (


    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">

      <div className="max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-left">List Your Trip</h1>
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 1 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
              <UserCheck size={18} />
            </div>
            <div className=" bg-gray-50 pt-20 pb-12">
              {/* Toast Notification */}
              {showToast && (
                <div
                  style={{
                    position: 'fixed',
                    top: 24,
                    right: 24,
                    background: '#14b8a6',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 180,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ flex: 1 }}>Your OTP is: {generatedOtp}</span>
                  <button
                    onClick={handleCloseToast}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'white',
                      fontSize: 18,
                      marginLeft: 12,
                      cursor: 'pointer',
                      lineHeight: 1,
                    }}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              )}
              {/* ... existing code ... */}
            </div>


            <div className={`h-1 w-8 ${step > 1 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step >= 2 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
              <Truck size={18} />
            </div>
            <div className={`h-1 w-8 ${step > 2 ? 'bg-teal-500' : 'bg-gray-200'}`}></div>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${step === 3 ? 'border-teal-500 bg-teal-500 text-white' : 'border-gray-300 bg-white text-gray-400'}`}>
              <FileText size={18} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Aadhaar OTP Verification */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <UserCheck size={20} className="mr-2" />Aadhaar Verification (with OTP)
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
              {/* Verification Animation and Next Step */}
              {aadhaarNumber && aadhaarPhone && /^\d{12}$/.test(aadhaarNumber) && /^\d{10}$/.test(aadhaarPhone) && (
                <div className="flex flex-col items-center mb-4">
                  {/* Tick Animation */}
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
          {/* Step 2, Step 3 ... unchanged */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center"><Truck size={20} className="mr-2" />Trip Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">From</label> */}
                  <LocationAutocomplete
                    id="source"
                    label="From"
                    value={source}
                    onChange={setSource}
                    required
                    icon={<Search size={18} />}
                  />
                </div>
                <div>
                  {/* <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">To</label> */}
                  <LocationAutocomplete
                    id="destination"
                    label="To"
                    value={destination}
                    onChange={setDestination}
                    required
                    icon={<Search size={18} />}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Calendar size={16} className="mr-1" />Date of Journey
                  </label>
                  <input
                    type="date"
                    value={departureDate}
                    onChange={e => setDepartureDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Timer size={16} className="mr-1" />Duration (hours)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={168}
                    value={duration}
                    onChange={e => setDuration(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Means of Transport</label>
                  <select
                    value={transport}
                    onChange={e => setTransport(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  >
                    <option value="">Select</option>
                    {transportModes.map(mode => (
                      <option key={mode.value} value={mode.value}>{mode.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center mt-6">
                  <input
                    id="fragile"
                    type="checkbox"
                    checked={acceptsFragile}
                    onChange={e => setAcceptsFragile(e.target.checked)}
                    className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                  />
                  <label htmlFor="fragile" className="ml-2 block text-sm text-gray-700 flex items-center">
                    <PackageCheck size={16} className="mr-1 text-gray-500" />
                    Accept Fragile Items
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <PackageCheck size={16} className="mr-1" />Capacity (Weight in kg)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={capacityWeight}
                    onChange={e => setCapacityWeight(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Box size={16} className="mr-1" />Capacity (Volume in m³)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={capacityVolume}
                    onChange={e => setCapacityVolume(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category of Goods</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1 rounded-full border ${acceptedCategories.includes(cat) ? 'bg-teal-500 text-white border-teal-500' : 'bg-gray-100 text-gray-700 border-gray-300'} transition-colors`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold"
                >
                  Back
                </button>
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

          {/* Step 3: Identification & Cost */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center"><FileText size={20} className="mr-2" />Identification & Cost</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <Upload size={16} className="mr-1" />Upload Latest Photo for Identification
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange(setIdentificationPhoto)}
                    className="w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <IndianRupee size={16} className="mr-1" />Cost of Service (in ₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Trip Description</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Describe your trip, special instructions, etc."
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleBack}
                  className="bg-gray-200 text-gray-700 px-8 py-2 rounded-md hover:bg-gray-300 transition-colors font-semibold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-teal-500 text-white px-8 py-2 rounded-md hover:bg-teal-600 transition-colors font-semibold"
                  disabled={!identificationPhoto || price <= 0}
                >
                  List Trip
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ListTripPage;
