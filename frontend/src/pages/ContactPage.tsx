import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ContactPage = () => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on mount
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center pt-20 px-2 py-10">
      <h1 className="text-4xl font-bold text-gray mb-2 text-center"><u>Contact Us</u></h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 text-center max-w-2xl">
      For Inquiries, Support, or Feedback, Please Fill Out the Form Below Or Use the Contact Details Provided.
      </p>
      <div
        ref={cardRef}
        className="w-full max-w-5xl bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col md:flex-row overflow-hidden"
      >
        {/* Contact Info */}
        <div className="bg-gray-800 text-white flex-1 p-8 flex flex-col justify-center space-y-8">
          <div className="flex items-center space-x-4">
            {/* Address Icon */}
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
              <circle cx="12" cy="9" r="2.5" />
            </svg>
            <a href='https://www.google.com/maps/place/Sampaarsh+Technology/@22.293808,70.7496163,17z/data=!3m1!4b1!4m6!3m5!1s0x3959cb002b3686bf:0xedcc7c19f52f02c6!8m2!3d22.293808!4d70.7521912!16s%2Fg%2F11lctx91mv?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D'>
              <div>
                <div className="font-semibold">Address</div>
                <div className="text-sm">Vedant Patel<br/>360007,Rajkot,Gujarat</div>
              </div>
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {/* Phone Icon */}
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M22 16.92V21a1 1 0 0 1-1.09 1A19.91 19.91 0 0 1 3 5.09 1 1 0 0 1 4 4h4.09a1 1 0 0 1 1 .75l1.09 4.36a1 1 0 0 1-.29 1L8.21 11.79a16 16 0 0 0 6 6l1.68-1.68a1 1 0 0 1 1-.29l4.36 1.09a1 1 0 0 1 .75 1V21z" />
            </svg>
            <div>
              <div className="font-semibold">Phone</div>
              <div className="text-sm">+1-555-123-4567</div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Email Icon */}
            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M4 4h16v16H4z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <div>
              <div className="font-semibold">Email</div>
              <a href="mailto:tagalong.samparsh@gmail.com" >
              <div className="text-sm break-all">tagalong@gmail.com</div></a>
            </div>
          </div>
        </div>
        {/* Contact Form */}
        <div className="flex-1 p-8 bg-white flex flex-col justify-center">
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                placeholder="Email"
              />
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">Type your Message...</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
                rows={4}
                placeholder="Type your Message..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-500 text-white font-semibold py-2 rounded hover:bg-cyan-600 transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;