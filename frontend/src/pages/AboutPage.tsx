import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Leaf, ShieldCheck, Wallet, Headphones, MapPin, Users, Heart, Globe, ArrowRight, Truck } from 'lucide-react';

const features = [
  {
    icon: <Leaf className="h-7 w-7 text-teal-600" />,
    title: 'Eco-Friendly Shipping',
    desc: 'Reduce carbon footprint by utilizing existing travel routes instead of adding new vehicles on the road.',
    gradient: 'from-teal-500 to-emerald-500',
    bg: 'bg-teal-50',
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-blue-600" />,
    title: 'Secure & Reliable',
    desc: 'Verified travelers, encrypted messaging, and secure Stripe payments for total peace of mind.',
    gradient: 'from-blue-500 to-indigo-500',
    bg: 'bg-blue-50',
  },
  {
    icon: <Wallet className="h-7 w-7 text-emerald-600" />,
    title: 'Earn While You Travel',
    desc: 'Travelers can monetize unused luggage space and offset their trip costs effortlessly.',
    gradient: 'from-emerald-500 to-teal-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: <MapPin className="h-7 w-7 text-violet-600" />,
    title: 'Real-Time Tracking',
    desc: "Track your parcel's journey in real time with live updates and delivery confirmations.",
    gradient: 'from-violet-500 to-purple-500',
    bg: 'bg-violet-50',
  },
  {
    icon: <Headphones className="h-7 w-7 text-amber-600" />,
    title: '24/7 Support',
    desc: 'Our dedicated support team is always available to help with any questions or concerns.',
    gradient: 'from-amber-500 to-orange-500',
    bg: 'bg-amber-50',
  },
  {
    icon: <Users className="h-7 w-7 text-rose-600" />,
    title: 'Global Community',
    desc: 'Join a growing worldwide network of responsible travelers and senders making logistics human.',
    gradient: 'from-rose-500 to-pink-500',
    bg: 'bg-rose-50',
  },
];

const stats = [
  { value: '10K+', label: 'Active Users', icon: <Users className="h-6 w-6" /> },
  { value: '25K+', label: 'Deliveries Made', icon: <Truck className="h-6 w-6" /> },
  { value: '50+', label: 'Cities Covered', icon: <Globe className="h-6 w-6" /> },
  { value: '4.8★', label: 'Average Rating', icon: <Heart className="h-6 w-6" /> },
];

const AboutPage = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }

    if (statsRef.current) {
      gsap.fromTo(
        statsRef.current.children,
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, delay: 0.3, ease: 'power3.out' }
      );
    }

    if (missionRef.current) {
      gsap.fromTo(
        missionRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' }
      );
    }

    if (featuresRef.current) {
      gsap.fromTo(
        featuresRef.current.children,
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.12, delay: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative pt-32 pb-20 px-4 text-center overflow-hidden"
      >
        {/* Decorative background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-blue-200 rounded-full opacity-15 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-sm font-semibold mb-6">
            <Leaf className="h-4 w-4" />
            Smarter, Greener Logistics
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            About{' '}
            <span className="bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text text-transparent">
              TagAlong
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We're redefining logistics by connecting travelers with senders — making shipping
            smarter, more affordable, and kinder to the planet.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 mb-16">
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 text-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-500 text-white mb-3">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div ref={missionRef} className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              <p>
                Born out of a simple idea — <span className="text-teal-600 font-semibold">that there's already someone going your way</span> — TagAlong transforms unused travel space into opportunity.
              </p>
              <p>
                Whether you're a traveler looking to earn a little extra by carrying items, or someone who wants to send something without the high cost and environmental impact of standard shipping, TagAlong makes it simple, safe, and efficient.
              </p>
              <p>
                We're on a mission to reduce carbon footprints, lower shipping costs, and build a global community of responsible travelers and senders. Together, we're making logistics more <strong>human</strong>, <strong>sustainable</strong>, and <strong>collaborative</strong>.
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-1 w-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full" />
              <span className="text-teal-600 dark:text-teal-400 font-semibold text-lg">Connect. Carry. Care.</span>
            </div>
          </div>

          {/* Visual card */}
          <div className="relative">
            <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-3xl p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-bold mb-6">Why We Exist</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">1</div>
                  <p className="text-teal-50">Every day, millions of travelers have unused luggage space on their journeys.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">2</div>
                  <p className="text-teal-50">Traditional shipping adds unnecessary vehicles, cost, and emissions.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">3</div>
                  <p className="text-teal-50">TagAlong bridges this gap — turning empty space into smart, green delivery.</p>
                </div>
              </div>
            </div>
            {/* Decorative floating dots */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-teal-200 rounded-full opacity-40 blur-xl" />
            <div className="absolute -bottom-6 -left-6 w-28 h-28 bg-blue-200 rounded-full opacity-30 blur-xl" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Makes Us Different</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            TagAlong combines technology, community, and sustainability to deliver a shipping experience unlike any other.
          </p>
        </div>
        <div
          ref={featuresRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 dark:border-gray-700 p-7 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${feature.bg} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-teal-500 to-blue-600 rounded-3xl shadow-2xl p-10 md:p-14 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                Ready to Join the Movement?
              </h2>
              <p className="text-teal-100 text-lg max-w-xl mx-auto mb-8">
                Start sending smarter or earning by carrying parcels along your route today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-teal-600 bg-white hover:bg-teal-50 transition-all text-lg shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/search"
                  className="inline-flex items-center justify-center px-8 py-3 rounded-xl font-semibold text-white bg-white/15 hover:bg-white/25 backdrop-blur transition-all text-lg border border-white/30"
                >
                  Browse Trips
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;