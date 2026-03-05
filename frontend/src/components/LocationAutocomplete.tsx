import React, { useRef, useEffect, useState } from 'react';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  required?: boolean;
  label?: string;
  icon?: React.ReactNode;
}

declare global {
  interface Window {
    google: any;
  }
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = 'City, State',
  className = '',
  id,
  required = false,
  label,
  icon
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    // Initialize GoMaps.pro Places Autocomplete when the component mounts
    if (!inputRef.current || !window.google) return;

    const options = {
      types: ['(cities)'], // Restrict to cities
      fields: ['address_components', 'formatted_address', 'geometry', 'name'],
    };

    // Using the same API structure as Google Maps since GoMaps.pro maintains compatibility
    const autocompleteInstance = new window.google.maps.places.Autocomplete(
      inputRef.current,
      options
    );

    // Store the autocomplete instance
    setAutocomplete(autocompleteInstance);

    // Add listener for place selection
    autocompleteInstance.addListener('place_changed', () => {
      const place = autocompleteInstance.getPlace();
      if (place && place.formatted_address) {
        onChange(place.formatted_address);
      }
    });

    // Cleanup function
    return () => {
      if (autocompleteInstance && window.google) {
        window.google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [onChange]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          className={`pl-10 w-full h-12 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent ${className}`}
          required={required}
        />
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500">{icon}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationAutocomplete;