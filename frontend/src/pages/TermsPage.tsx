import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const TermsPage: React.FC = () => {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20 pb-16 px-4 relative overflow-x-hidden">
      {/* Decorative SVG background */}
      <svg className="absolute left-0 top-0 w-full h-80 opacity-10 pointer-events-none" viewBox="0 0 1440 320">
        <path fill="#14b8a6" fillOpacity="1" d="M0,224L60,197.3C120,171,240,117,360,117.3C480,117,600,171,720,197.3C840,224,960,224,1080,197.3C1200,171,1320,117,1380,90.7L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path>
      </svg>
      <div className="max-w-4xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8"><u><center>Terms and Conditions</center></u></h1>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Effective Date</h2>
          <p className="text-gray-700 leading-relaxed">19th May 2025</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to TagAlong! These Terms and Conditions govern your access to and use of our logistics platform, available via our website [TagAlong.com] and any associated applications (collectively, the “Service”). By accessing or using our Service, you agree to be bound by these Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you do not agree to these Terms, please do not use the Service.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Definitions</h2>
          <p className="text-gray-700 leading-relaxed">
            “Sender” refers to a registered user who creates a delivery request for a package or item.
          </p>
          <p className="text-gray-700 leading-relaxed">
            “Carrier” refers to a registered user who accepts and completes a delivery request.
          </p>
          <p className="text-gray-700 leading-relaxed">
            “User” refers to any individual who registers and uses the platform, whether as a Sender or Carrier.
          </p>
          <p className="text-gray-700 leading-relaxed">
            “Service” refers to the platform functionality, including package posting, delivery matching, and communication features.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Eligibility</h2>
          <p className="text-gray-700 leading-relaxed">
            You must be at least 18 years old to use this Service. By using our Service, you represent and warrant that:
          </p>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>You are legally able to enter into a binding contract.</li>
            <li>You will use the platform in compliance with all applicable laws and regulations.</li>
            <li>You are providing accurate, current, and complete information.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Responsibilities</h2>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">For Senders:</h3>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>Ensure the parcel complies with local and international shipping laws.</li>
            <li>Do not send illegal, prohibited, hazardous, or restricted items.</li>
            <li>Properly package the item to prevent damage during transit.</li>
            <li>Accurately describe the parcel and declare its value.</li>
            <li>Pay the agreed-upon delivery fee to the Carrier.</li>
          </ul>
          <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">For Carriers:</h3>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>Deliver the item in the agreed-upon condition and time.</li>
            <li>Ensure that you have the legal right and capability to transport goods.</li>
            <li>Maintain all necessary permits and insurance if required.</li>
            <li>Do not open, tamper with, or use the items being transported.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Prohibited Items</h2>
          <p className="text-gray-700 leading-relaxed">
            Users are strictly prohibited from sending the following:
          </p>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>Illegal substances or drugs</li>
            <li>Weapons or explosives</li>
            <li>Perishable food items (unless specifically agreed upon)</li>
            <li>Live animals</li>
            <li>Counterfeit goods</li>
            <li>Stolen items</li>
            <li>Hazardous materials or chemicals</li>
          </ul>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to reject or terminate shipments suspected to involve such items.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payments and Fees</h2>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>The platform may charge a service fee on each completed transaction.</li>
            <li>Payment is facilitated securely through our integrated payment gateway.</li>
            <li>Users agree to the pricing and payment structure at the time of booking.</li>
            <li>Refunds may be provided under certain conditions as outlined in our Refund Policy.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Dispute Resolution</h2>
          <p className="text-gray-700 leading-relaxed">
            In case of disputes between Sender and Carrier:
          </p>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>First, attempt to resolve the matter directly via the in-app communication tools.</li>
            <li>If unresolved, contact TagAlong Support with full documentation.</li>
            <li>TagAlong will act as a neutral mediator but does not guarantee any outcome.</li>
            <li>Legal disputes will be handled according to the jurisdiction outlined below.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Insurance and Liability</h2>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>TagAlong does not provide shipping insurance by default.</li>
            <li>Senders and Carriers are responsible for arranging additional insurance if needed.</li>
            <li>We are not liable for loss, theft, or damage unless proven due to gross negligence on our part.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Suspension or Termination</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to suspend or terminate any user account at our discretion, particularly if:
          </p>
          <ul className="list-disc pl-5 text-gray-700 leading-relaxed">
            <li>You violate any provision of these Terms.</li>
            <li>You engage in fraudulent, illegal, or abusive behavior.</li>
            <li>You provide false or misleading information.</li>
          </ul>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All content, design, graphics, and functionality on the platform are owned by TagAlong and protected by intellectual property laws. You may not reproduce, modify, or distribute any part without written permission.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy</h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and disclose your information.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Modifications to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We may update or modify these Terms from time to time. We will notify users via email or in-app notifications. Continued use of the Service after changes means you accept the new terms.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of [Insert Jurisdiction, e.g., the State of California, USA], without regard to its conflict of laws principles.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions or concerns about these terms, please contact our support team. We are here to assist you and ensure your experience with TagAlong is positive and secure.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;