import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Search, HelpCircle, Truck, CreditCard, Shield, UserCheck, MessageCircle, Package, Globe } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  bg: string;
  faqs: FAQItem[];
}

const faqCategories: FAQCategory[] = [
  {
    title: 'Getting Started',
    icon: <HelpCircle className="h-6 w-6" />,
    gradient: 'from-teal-500 to-emerald-500',
    bg: 'bg-teal-50',
    faqs: [
      {
        question: 'What is TagAlong?',
        answer: 'TagAlong is a peer-to-peer delivery platform that connects travelers with individuals who want to send items along the same route. Travelers can earn by carrying parcels, and senders save on shipping costs — all while reducing carbon emissions.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Click "Sign Up" on the homepage, fill in your name, email, phone number, and create a password. You can start browsing trips immediately after registration.',
      },
      {
        question: 'Is TagAlong available in my area?',
        answer: 'TagAlong is growing rapidly and available across 50+ cities in India. Enter your source and destination in the search bar to find available travelers on your route.',
      },
    ],
  },
  {
    title: 'For Senders',
    icon: <Package className="h-6 w-6" />,
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
    faqs: [
      {
        question: 'How do I send a parcel?',
        answer: 'Search for trips matching your route and dates. Once you find a suitable traveler, send them a message to discuss your parcel details, then create a delivery request and make a secure payment through Stripe.',
      },
      {
        question: 'What items can I send?',
        answer: 'You can send most non-prohibited items including documents, gifts, electronics, clothing, and more. Hazardous materials, illegal substances, and perishable goods are not allowed. Some travelers also accept fragile items — look for the "Accepts Fragile" badge.',
      },
      {
        question: 'How do I track my parcel?',
        answer: 'Once your parcel is picked up, you can track its journey in real-time through the app. You\'ll receive notifications at each stage — pickup, in transit, and delivered.',
      },
    ],
  },
  {
    title: 'For Travelers',
    icon: <Truck className="h-6 w-6" />,
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
    faqs: [
      {
        question: 'How do I list a trip?',
        answer: 'Go to "List a Trip" and enter your route details, travel dates, available capacity (weight and volume), and your price per package. You\'ll need to complete identity verification before your first trip listing.',
      },
      {
        question: 'How much can I earn?',
        answer: 'Earnings depend on the route, parcel size, and your pricing. On average, travelers earn ₹200–₹2000 per delivery. You set your own prices and can accept or decline any delivery request.',
      },
      {
        question: 'Do I need to verify my identity?',
        answer: 'Yes, identity verification is required for travelers to ensure safety for all users. You can verify using your Aadhaar card — our OCR system makes the process quick and seamless.',
      },
    ],
  },
  {
    title: 'Payments & Billing',
    icon: <CreditCard className="h-6 w-6" />,
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
    faqs: [
      {
        question: 'How do payments work?',
        answer: 'Payments are processed securely through Stripe. The sender pays when creating a delivery request, and the traveler receives the payment once the delivery is confirmed as complete.',
      },
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept all major credit/debit cards, UPI, and net banking through our Stripe integration. All transactions are encrypted and PCI-DSS compliant.',
      },
      {
        question: 'Can I get a refund?',
        answer: 'If a delivery is cancelled before pickup, you\'ll receive a full refund. In case of disputes or damaged items, contact our support team and we\'ll resolve it within 48 hours.',
      },
    ],
  },
  {
    title: 'Safety & Security',
    icon: <Shield className="h-6 w-6" />,
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
    faqs: [
      {
        question: 'How does TagAlong ensure safety?',
        answer: 'We verify traveler identities using Aadhaar OCR, provide end-to-end encrypted messaging, process payments securely through Stripe, and maintain a rating system so users can make informed decisions.',
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Absolutely. We use industry-standard encryption for all data. Your personal details are never shared with other users without your consent. Chat messages are AES-encrypted.',
      },
      {
        question: 'What if something goes wrong with my delivery?',
        answer: 'Contact our 24/7 support team immediately. We have a dispute resolution process and will work to find a fair solution for both parties. You can also report issues directly through the notification system.',
      },
    ],
  },
  {
    title: 'Account & Profile',
    icon: <UserCheck className="h-6 w-6" />,
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
    faqs: [
      {
        question: 'How do I edit my profile?',
        answer: 'Go to Settings from the dropdown menu. You can update your name, avatar, email, phone number, and password. Changes to email and phone require re-verification.',
      },
      {
        question: 'How does the rating system work?',
        answer: 'After each delivery, both sender and traveler can rate each other on a 5-star scale. Ratings are averaged and displayed on profiles to help build trust in the community.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, you can delete your account from Settings > Delete Account. This action is permanent and will remove all your data, trip listings, and chat history.',
      },
    ],
  },
];

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onToggle: () => void }> = ({
  item,
  isOpen,
  onToggle,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        gsap.to(contentRef.current, {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      } else {
        gsap.to(contentRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.25,
          ease: 'power2.in',
        });
      }
    }
  }, [isOpen]);

  return (
    <div className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 px-1 text-left group"
      >
        <span className={`text-base font-medium transition-colors duration-200 ${isOpen ? 'text-teal-600' : 'text-gray-800 group-hover:text-teal-600'}`}>
          {item.question}
        </span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 ml-4 transition-all duration-300 ${isOpen ? 'text-teal-500 rotate-180' : 'text-gray-400'}`}
        />
      </button>
      <div ref={contentRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="pb-5 px-1 text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
          {item.answer}
        </p>
      </div>
    </div>
  );
};

const FAQPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    if (categoriesRef.current) {
      gsap.fromTo(
        categoriesRef.current.children,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, delay: 0.3, ease: 'power3.out' }
      );
    }
  }, []);

  // Reset open FAQ when switching categories
  useEffect(() => {
    setOpenFaq(null);
  }, [activeCategory]);

  // Filter FAQs based on search query
  const filteredCategories = searchQuery.trim()
    ? faqCategories.map(cat => ({
      ...cat,
      faqs: cat.faqs.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    })).filter(cat => cat.faqs.length > 0)
    : faqCategories;

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-200 rounded-full opacity-15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold mb-6">
            <MessageCircle className="h-4 w-4" />
            Help Center
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            How can we{' '}
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              help you?
            </span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8">
            Find answers to common questions about TagAlong, shipping, payments, and more.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent text-gray-800 text-lg placeholder:text-gray-400 transition-shadow"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        {isSearching ? (
          /* Search Results View */
          <div>
            <p className="text-sm text-gray-500 mb-6">
              {filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} result(s) found for "{searchQuery}"
            </p>
            {filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-500">Try different keywords or browse categories below.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-7 py-4 bg-gray-50 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${cat.gradient} text-white`}>
                        {cat.icon}
                      </div>
                      <h3 className="font-semibold text-gray-800">{cat.title}</h3>
                    </div>
                    <div className="px-7">
                      {cat.faqs.map((faq, faqIdx) => (
                        <AccordionItem
                          key={faqIdx}
                          item={faq}
                          isOpen={openFaq === catIdx * 100 + faqIdx}
                          onToggle={() => setOpenFaq(openFaq === catIdx * 100 + faqIdx ? null : catIdx * 100 + faqIdx)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Category View */
          <div className="grid md:grid-cols-[280px_1fr] gap-8">
            {/* Category Sidebar */}
            <div ref={categoriesRef} className="space-y-2">
              {faqCategories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveCategory(idx)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl text-left transition-all duration-200 ${activeCategory === idx
                      ? 'bg-white shadow-lg border border-gray-100 dark:border-gray-700 text-teal-600'
                      : 'text-gray-600 hover:bg-white/60 hover:shadow-sm'
                    }`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${activeCategory === idx
                        ? `bg-gradient-to-br ${cat.gradient} text-white shadow-md`
                        : `${cat.bg} text-gray-500`
                      }`}
                  >
                    {cat.icon}
                  </div>
                  <span className="font-medium">{cat.title}</span>
                  {activeCategory === idx && (
                    <div className="ml-auto w-1.5 h-8 bg-gradient-to-b from-teal-400 to-blue-500 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* FAQ Content */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              {/* Category Header */}
              <div className={`px-8 py-6 bg-gradient-to-r ${faqCategories[activeCategory].gradient} text-white`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    {faqCategories[activeCategory].icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{faqCategories[activeCategory].title}</h2>
                    <p className="text-white/80 text-sm">{faqCategories[activeCategory].faqs.length} questions</p>
                  </div>
                </div>
              </div>

              {/* FAQ Items */}
              <div className="px-8">
                {faqCategories[activeCategory].faqs.map((faq, idx) => (
                  <AccordionItem
                    key={idx}
                    item={faq}
                    isOpen={openFaq === idx}
                    onToggle={() => setOpenFaq(openFaq === idx ? null : idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Contact CTA */}
      <section className="pb-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 mb-5">
                <Globe className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Still have questions?</h2>
              <p className="text-teal-100 mb-6 max-w-md mx-auto">
                Can't find what you're looking for? Our support team is here to help 24/7.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-teal-600 bg-white hover:bg-teal-50 transition-all text-lg shadow-lg"
              >
                Contact Support
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;