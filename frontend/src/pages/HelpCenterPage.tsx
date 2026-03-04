import React, { useEffect, useRef, useState } from 'react';
import { Search, LifeBuoy, MessageCircle, ShieldCheck, UserCheck, CreditCard, Truck, ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const helpTopics = [
  {
    icon: <LifeBuoy size={32} className="text-teal-500" />,
    title: 'Getting Started',
    desc: 'Learn how to create an account, set up your profile, and start using TagAlong.',
    button: 'Read Guide',
  },
  {
    icon: <Truck size={32} className="text-blue-500" />,
    title: 'Booking & Deliveries',
    desc: 'How to book a trip, send a package, and track your deliveries.',
    button: 'How It Works',
  },
  {
    icon: <CreditCard size={32} className="text-orange-500" />,
    title: 'Payments & Pricing',
    desc: 'Understand payment methods, pricing, and how to manage transactions.',
    button: 'View Details',
  },
  {
    icon: <ShieldCheck size={32} className="text-green-500" />,
    title: 'Safety & Trust',
    desc: 'Learn about our safety measures, verification, and community guidelines.',
    button: 'Safety Info',
  },
  {
    icon: <MessageCircle size={32} className="text-indigo-500" />,
    title: 'Messaging & Support',
    desc: 'How to contact travelers, senders, and get support from our team.',
    button: 'Contact Support',
  },
  {
    icon: <UserCheck size={32} className="text-pink-500" />,
    title: 'Account & Settings',
    desc: 'Manage your account, privacy settings, and notification preferences.',
    button: 'Account Help',
  },
];

const HelpCenterPage: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeTopic, setActiveTopic] = useState<null | typeof helpTopics[0]>(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
    if (sliderRef.current) {
      gsap.fromTo(
        sliderRef.current.children,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          delay: 0.5,
          ease: 'power3.out',
        }
      );
    }
  }, []);

  // Progress bar and auto-scroll logic with infinite loop
  useEffect(() => {
    if (!sliderRef.current) return;
    let interval: ReturnType<typeof setInterval>;
    let progressInterval: ReturnType<typeof setInterval>;
    const slider = sliderRef.current;
    const card = slider.children[0] as HTMLElement;
    if (!card) return;

    const scrollAmount = card.offsetWidth + 32;
    const originalCardsCount = helpTopics.length;
    const duration = 1500; // 1.5 seconds

    function autoScroll() {
      if (!sliderRef.current) return;
      if (slider.scrollLeft >= scrollAmount * originalCardsCount) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }

    if (!isHovered) {
      setProgress(0);
      let start = Date.now();
      progressInterval = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min((elapsed / duration) * 100, 100);
        setProgress(percent);
        if (percent >= 100) {
          autoScroll();
          start = Date.now();
          setProgress(0);
        }
      }, 20);
    }

    return () => {
      clearInterval(progressInterval);
      setProgress(0);
    };
  }, [isHovered]);

  // Scroll handler (manual)
  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    const card = slider.children[0] as HTMLElement;
    if (!card) return;
    const scrollAmount = card.offsetWidth + 32; // card width + gap (adjust gap if needed)
    const originalCardsCount = helpTopics.length;

    if (direction === 'left') {
      // If at the start, jump to the end of the original cards
      if (slider.scrollLeft <= 0) {
        slider.scrollLeft = scrollAmount * originalCardsCount;
      } else {
        slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    } else {
      // If at (or past) the end of the original cards, reset to start
      if (
        slider.scrollLeft >=
        scrollAmount * originalCardsCount
      ) {
        slider.scrollLeft = 0;
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-16 px-2 relative overflow-x-hidden">
      {/* Decorative SVG background */}
      <svg className="absolute left-0 top-0 w-full h-80 opacity-10 pointer-events-none" viewBox="0 0 1440 320">
        <path fill="#14b8a6" fillOpacity="1" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
      </svg>
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Animated Header */}
        <div ref={headerRef} className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">
            <u>Help Center</u>
            
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            How can we help you? Browse our most common help topics or search for answers.
          </p>
          <div className="flex justify-center">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                placeholder="Search help articles, topics, or FAQs"
                className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 text-lg shadow"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400" size={22} />
            </div>
          </div>
        </div>
        {/* Slideshow of Help Cards with scroll buttons */}
        <div className="mt-12 relative">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Popular Help Topics</h2>
          {/* Fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
          <div className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 bg-gradient-to-l from-white via-white/80 to-transparent"></div>
          {/* Left Arrow */}
          <button
            aria-label="Scroll left"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-teal-100 border border-teal-200 shadow-lg rounded-full p-3 transition-all"
            onClick={() => scrollSlider('left')}
          >
            <ChevronLeft size={32} className="text-teal-500" />
          </button>
          {/* Right Arrow */}
          <button
            aria-label="Scroll right"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-teal-100 border border-teal-200 shadow-lg rounded-full p-3 transition-all"
            onClick={() => scrollSlider('right')}
          >
            <ChevronRight size={32} className="text-teal-500" />
          </button>
          <div
            ref={sliderRef}
            className="flex gap-8 overflow-x-auto pb-4 px-16 snap-x snap-mandatory hide-scrollbar"
            style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Original cards */}
            {helpTopics.map((topic, idx) => (
              <div
                key={topic.title}
                className="min-w-[320px] max-w-xs flex-shrink-0 bg-white rounded-3xl shadow-xl border-t-4 border-teal-100 hover:border-teal-400 transition-all duration-300 flex flex-col items-center p-8 mx-auto snap-center
                  transform hover:scale-105 focus-within:scale-105"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="mb-4">{topic.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">{topic.title}</h3>
                <p className="text-gray-600 text-center mb-4">{topic.desc}</p>
                <button
                  className="mt-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold px-5 py-2 rounded-xl flex items-center transition-all duration-200 shadow"
                  onClick={() => setActiveTopic(topic)}
                >
                  {topic.button}
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            ))}
            {/* Cloned cards for infinite scroll */}
            {helpTopics.map((topic, idx) => (
              <div
                key={topic.title + '-clone'}
                className="min-w-[320px] max-w-xs flex-shrink-0 bg-white rounded-3xl shadow-xl border-t-4 border-teal-100 hover:border-teal-400 transition-all duration-300 flex flex-col items-center p-8 mx-auto snap-center
                  transform hover:scale-105 focus-within:scale-105"
                style={{ scrollSnapAlign: 'center' }}
              >
                <div className="mb-4">{topic.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">{topic.title}</h3>
                <p className="text-gray-600 text-center mb-4">{topic.desc}</p>
                <button
                  className="mt-auto bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-semibold px-5 py-2 rounded-xl flex items-center transition-all duration-200 shadow"
                  onClick={() => setActiveTopic(topic)}
                >
                  {topic.button}
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            ))}
          </div>
          {/* Progress Dots Only */}
          <div className="w-full flex justify-center mt-4">
            <div className="flex gap-2">
              {helpTopics.map((_, i) => {
                let active = false;
                const slider = sliderRef.current;
                if (slider && slider.children.length) {
                  const card = slider.children[0] as HTMLElement;
                  if (card) {
                    const cardWidth = card.offsetWidth + 32;
                    const idx = Math.round(slider.scrollLeft / cardWidth) % helpTopics.length;
                    active = idx === i;
                  }
                }
                return (
                  <span
                    key={i}
                    className={
                      active
                        ? "w-4 h-4 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full border-2 border-teal-400"
                        : "w-2 h-2 bg-white border-2 border-teal-300 rounded-full"
                    }
                  />
                );
              })}
            </div>
          </div>
          {/* Popup Modal */}
          {activeTopic && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full relative">
                <button
                  className="absolute top-3 right-3 text-gray-400 hover:text-teal-500 text-2xl"
                  onClick={() => setActiveTopic(null)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center">
                  <div className="mb-4">{activeTopic.icon}</div>
                  <h2 className="text-2xl font-bold mb-2 text-center">{activeTopic.title}</h2>
                  {activeTopic.title === "Getting Started" && (
                    <div>
                      <p className="text-gray-700 text-center mb-4">
                        Welcome to TagAlong! To get started, create your account, set up your profile with your travel or delivery preferences, and explore our platform. Whether you're a traveler or a sender, our intuitive interface makes it easy to connect and manage your journeys.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 text-sm mb-2 list-disc pl-5">
                        <li>Sign up with your email or social account</li>
                        <li>Complete your profile for better matches</li>
                        <li>Browse available trips or delivery requests</li>
                      </ul>
                    </div>
                  )}
                  {activeTopic.title === "Booking & Deliveries" && (
                    <div>
                      <p className="text-gray-700 text-center mb-4">
                        Booking a trip or sending a package is simple with TagAlong. Choose your route, select your preferences, and track your deliveries in real-time. Our platform ensures safe and reliable connections between travelers and senders.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 text-sm mb-2 list-disc pl-5">
                        <li>Find trips that match your schedule</li>
                        <li>Book instantly or send a request</li>
                        <li>Track your delivery status at every step</li>
                      </ul>
                    </div>
                  )}
                  {activeTopic.title === "Payments & Pricing" && (
                    <div>
                      <p className="text-gray-700 text-center mb-4">
                        TagAlong offers secure and transparent payment options. Review pricing before you book, pay safely through our platform, and manage all your transactions in one place.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 text-sm mb-2 list-disc pl-5">
                        <li>Multiple payment methods supported</li>
                        <li>Clear pricing with no hidden fees</li>
                        <li>View your payment history anytime</li>
                      </ul>
                    </div>
                  )}
                  {activeTopic.title === "Safety & Trust" && (
                    <div>
                      <p className="text-gray-700 text-center mb-4">
                        Your safety is our top priority. TagAlong verifies all users, provides secure messaging, and offers community guidelines to ensure a trustworthy environment for everyone.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 text-sm mb-2 list-disc pl-5">
                        <li>User verification and profile checks</li>
                        <li>Secure in-app communication</li>
                        <li>24/7 support for any concerns</li>
                      </ul>
                    </div>
                  )}
                  {activeTopic.title === "Messaging & Support" && (
                    <div>
                      <p className="text-gray-700 text-center mb-4">
                        Need help or want to connect with another user? Use our in-app messaging to communicate safely, or reach out to our support team for quick assistance.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 text-sm mb-2 list-disc pl-5">
                        <li>Message travelers or senders directly</li>
                        <li>Get instant notifications for replies</li>
                        <li>Contact our support team anytime</li>
                      </ul>
                    </div>
                  )}
                  {activeTopic.title === "Account & Settings" && (
                    <div>
                      <p className="text-gray-700 text-center mb-4">
                        Manage your TagAlong account with ease. Update your profile, adjust privacy settings, and control your notifications to personalize your experience.
                      </p>
                      <ul className="text-gray-600 dark:text-gray-400 text-sm mb-2 list-disc pl-5">
                        <li>Edit your personal information</li>
                        <li>Set your privacy and notification preferences</li>
                        <li>Deactivate or delete your account anytime</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Contact Support CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            Can't find what you're looking for?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-semibold rounded-xl text-white bg-gradient-to-r from-teal-500 to-blue-500 shadow-lg hover:from-teal-600 hover:to-blue-600 transition-all duration-300"
          >
            Contact Support <MessageCircle size={20} className="ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage