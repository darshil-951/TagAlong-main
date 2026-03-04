import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Shield, Truck, TrendingUp } from 'lucide-react';
import gsap from 'gsap';
import SearchForm, { SearchParams } from './SearchForm';

const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (heroRef.current) {
      const tl = gsap.timeline();

      tl.from('.hero-title', {
        y: 30,
        opacity: 0.9,
        duration: 0.6,
        ease: 'power3.out'
      })
        .from('.hero-subtitle', {
          y: 20,
          opacity: 0.8,
          ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-search', {
          y: 20,
          opacity: 1,
          ease: 'power3.out'
        }, '-=0.2')
        .from('.feature-item', {
          y: 20,
          opacity: 0.8,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        }, '-=0.2');
    }
  }, []);

  const handleSearch = (params: SearchParams) => {
    // In a real app, we would pass these parameters via query string
    navigate(`/search?source=${params.source}&destination=${params.destination}&date=${params.date}`);
  };

  return (
    <div 
      ref={heroRef}
      className="relative min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50 "
    >
      <div className="absolute inset-0 overflow-hidden ">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-24 relative z-10">
        <div className="text-center mb-10">
          <h1 className="hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Ship Smarter with <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">TagAlong</span>
          </h1>
          <p className="hero-subtitle text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Connect with travelers going your way. Ship your items affordably and sustainably.
          </p>
        </div>

        <div className="hero-search max-w-4xl mx-auto">
          <SearchForm onSearch={handleSearch} />
        </div>
        

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="feature-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-teal-500 hover:shadow-lg transition-shadow">
            <div className="rounded-full w-12 h-12 bg-teal-100 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Efficient Delivery</h3>
            <p className="text-gray-600">Utilize existing travel routes for faster, more efficient deliveries.</p>
          </div>
          
          <div className="feature-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="rounded-full w-12 h-12 bg-blue-100 flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cost Effective</h3>
            <p className="text-gray-600">Save up to 60% compared to traditional shipping methods.</p>
          </div>
          
          <div className="feature-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="rounded-full w-12 h-12 bg-orange-100 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Flexible Options</h3>
            <p className="text-gray-600">From small packages to larger items, find the right match for your needs.</p>
          </div>
          
          <div className="feature-item bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-t-4 border-indigo-500 hover:shadow-lg transition-shadow">
            <div className="rounded-full w-12 h-12 bg-indigo-100 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Safe & Secure</h3>
            <p className="text-gray-600">Verified profiles, ratings, and secure payments for peace of mind.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;