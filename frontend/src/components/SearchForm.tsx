import React, { useState, useEffect } from 'react';
import { Search, Calendar, PackageCheck, Box } from 'lucide-react';
import LocationAutocomplete from './LocationAutocomplete';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  className?: string;
  initialValues?: Partial<SearchParams>;
}


export interface SearchParams {
  source: string;
  destination: string;
  date: string;
  isFragile: boolean;
  weight: number;
  urgency: 'normal' | 'express';
  productType: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, className = '' }) => {
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
  }, []);

  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [isFragile, setIsFragile] = useState(false);
  const [weight, setWeight] = useState<number>(5);
  const [urgency, setUrgency] = useState<'normal' | 'express'>('normal');
  const [productType, setProductType] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      source,
      destination,
      date,
      isFragile,
      weight,
      urgency,
      productType
    });
  };

  const toggleAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">

            </label>
            <div className="relative">
              <LocationAutocomplete
                id="source"
                label="From"
                value={source}
                onChange={setSource}
                required
                icon={<Search size={18} />}
              />
            </div>
          </div>

          <div className="relative">
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">

            </label>
            <div className="relative">
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

          <div className="relative lg:col-span-1 md:col-span-2">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              When
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">
                  <Calendar size={18} />
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={toggleAdvanced}
            className="text-sm text-teal-600 hover:text-teal-800 focus:outline-none"
          >
            {showAdvanced ? 'Hide advanced options' : 'Show advanced options'}
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="productType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Type
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="productType"
                  placeholder="e.g., Electronics, Furniture, Clothes"
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Box size={18} className="text-gray-400" />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                min="1"
                max="100"
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="urgency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Delivery Speed
              </label>
              <select
                id="urgency"
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as 'normal' | 'express')}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="normal">Normal</option>
                <option value="express">Express</option>
              </select>
            </div>

            <div className="flex items-center">
              <div className="flex items-center h-full pt-6">
                <input
                  id="fragile"
                  type="checkbox"
                  checked={isFragile}
                  onChange={(e) => setIsFragile(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="fragile" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <PackageCheck size={18} className="mr-1 text-gray-500" />
                    Fragile Item
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-teal-500 text-white font-medium px-4 py-3 rounded-md hover:bg-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            Find Available Trips
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;