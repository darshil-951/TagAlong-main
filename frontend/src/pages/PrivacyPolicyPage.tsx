import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const PrivacyPolicyPage: React.FC = () => {
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
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8"><u>Privacy Policy</u></h1>
        </div>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            At TagAlong, your privacy is of utmost importance to us. We are dedicated to protecting your personal information and ensuring transparency in how we handle your data. This Privacy Policy outlines our practices for collecting, using, and safeguarding your information.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Verification</h2>
          <p className="text-gray-700 leading-relaxed">
            To foster a secure and trustworthy community, TagAlong mandates a verification process for all users before they can list services. This process requires the submission of valid documentation to confirm identity and eligibility. Only verified users are permitted to list trips or services on our platform.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Protection</h2>
          <p className="text-gray-700 leading-relaxed">
            We implement comprehensive security measures to protect your personal data. All information is securely stored and is not shared with third parties. Our systems are designed to prevent unauthorized access, ensuring your data remains confidential and secure.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Information Usage</h2>
          <p className="text-gray-700 leading-relaxed">
            The data we collect is used solely to enhance your experience on TagAlong. We do not sell or distribute your information to external entities. Our commitment is to use your data responsibly and with your privacy in mind.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions or concerns about our privacy practices, please reach out to our support team. We are dedicated to providing you with a safe and secure experience on TagAlong.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;