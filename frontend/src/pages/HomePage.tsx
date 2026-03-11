import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Truck, Shield, TrendingUp, Users, Star } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: <Truck className="h-8 w-8 text-teal-600" />,
    title: 'Efficient Delivery',
    desc: 'Leverage existing travel routes for faster, eco-friendly deliveries.',
    color: 'border-teal-500 bg-teal-50 dark:bg-teal-900/30'
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    title: 'Cost Effective',
    desc: 'Save up to 60% compared to traditional shipping methods.',
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: 'Safe & Secure',
    desc: 'Verified profiles, ratings, and secure payments for peace of mind.',
    color: 'border-green-500 bg-green-50 dark:bg-green-900/30'
  },
  {
    icon: <Users className="h-8 w-8 text-teal-700" />,
    title: 'Community Driven',
    desc: 'Join a growing network of responsible travelers and senders.',
    color: 'border-teal-700 bg-teal-100 dark:bg-teal-900/40'
  }
];

const testimonials = [
  {
    name: 'Jayati M.',
    city: 'Vadodara',
    img: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'TagAlong made sending a birthday gift so easy and affordable. Highly recommend!',
    stars: 5
  },
  {
    name: 'Dhaval',
    city: 'Mumbai',
    img: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'I offset my travel costs and met great people. Win-win!',
    stars: 5
  },
  {
    name: ' Rajvi',
    city: 'Rajkot',
    img: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=600',
    text: 'Needed to ship a fragile painting. TagAlong found me a careful driver!',
    stars: 4
  }
];

const HomePage: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null); // Add ref for animation

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    if (heroRef.current) {
      gsap.from(heroRef.current, {
        opacity: 9,
        y: 40,
        duration: 1,
        ease: 'power3.out'
      });
    }
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        opacity: 9,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
      });
    }
    if (howItWorksRef.current) {
      gsap.from(howItWorksRef.current.children, {
        opacity: 9,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.4
      });
    }
    if (testimonialsRef.current) {
      gsap.from(testimonialsRef.current.children, {
        opacity: 9,
        y: 40,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 0.5
      });
    }
  }, []);

  const { isAuthenticated } = useAuth(); // <-- Add this line

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center ">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 pt-20">
          Ship Smarter with
          <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent"> TagAlong</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8 pt-10">
          Connect with travelers going your way. Ship your items affordably, safely, and sustainably.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-10">
          <Link
            to="/search"
            className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all text-lg"
          >
            Find Trips
          </Link>
          {!isAuthenticated && (
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl font-semibold text-teal-600 dark:text-teal-400 bg-white dark:bg-gray-800 border border-teal-400 dark:border-teal-600 shadow hover:bg-teal-50 dark:hover:bg-gray-700 transition-all text-lg"
            >
              Join Now
            </Link>
          )}
        </div>
        <div className="absolute left-0 top-0 w-full h-80 opacity-10 pointer-events-none -z-10">
          <svg viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#14b8a6" fillOpacity="1" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 ">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center pt-20">Why TagAlong?</h2>
        <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center rounded-xl shadow-md p-8 border-t-4 ${feature.color} bg-white dark:bg-gray-800 hover:shadow-xl transition-shadow`}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How TagAlong Works Section */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">How TagAlong Works?</h2>
        <div ref={howItWorksRef} className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
          {/* Step 1 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-100 text-teal-600 mb-4 font-bold text-xl">1</div>
            <h3 className="font-semibold text-lg mb-2 text-center">Search for Trips</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">Enter your source, destination, and date to find travelers going your way.</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center w-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 20H30M30 20L24 14M30 20L24 26" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Step 2 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4 font-bold text-xl">2</div>
            <h3 className="font-semibold text-lg mb-2 text-center">Connect & Agree</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">Message the traveler, discuss your needs, and agree on delivery details.</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center w-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 20H30M30 20L24 14M30 20L24 26" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Step 3 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4 font-bold text-xl">3</div>
            <h3 className="font-semibold text-lg mb-2 text-center">Track Your Parcel</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">Track your item in real-time until it reaches its destination.</p>
          </div>
          {/* Arrow */}
          <div className="hidden md:flex flex-col items-center w-10">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M10 20H30M30 20L24 14M30 20L24 26" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          {/* Step 4 */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 w-full md:w-1/4 relative">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-teal-200 text-teal-700 mb-4 font-bold text-xl">4</div>
            <h3 className="font-semibold text-lg mb-2 text-center">Receive & Rate</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center">Receive your item and rate your experience to help our community.</p>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="bg-white dark:bg-gray-800 py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">What Our Users Say</h2>
          <div ref={testimonialsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center">
                <div className="flex text-yellow-400 mb-2">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} size={18} fill="#F59E0B" />
                  ))}
                  {[...Array(5 - t.stars)].map((_, i) => (
                    <Star key={i} size={18} className="text-gray-300" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-center mb-6">{t.text}</p>
                <div className="flex items-center">
                  <img src={t.img} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                  <div className="ml-3 text-left">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      {!isAuthenticated && ( // <-- Only show if NOT authenticated
        <section className="py-16 bg-gradient-to-r from-teal-500 to-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-teal-100 mb-8">
              Create an account in minutes and start connecting with travelers or find someone to transport your items.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-3 rounded-xl font-semibold text-teal-600 bg-white hover:bg-teal-50 transition-all text-lg"
              >
                Sign Up Now
              </Link>
              <Link
                to="/search"
                className="px-8 py-3 rounded-xl font-semibold text-white bg-teal-800 bg-opacity-80 hover:bg-opacity-100 transition-all text-lg"
              >
                Find Trips
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

