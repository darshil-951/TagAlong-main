import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../../images/logo.png';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <img src={logo} alt="TagAlong Logo" className="h-10 w-auto mr-2" />
              <span className="ml-2 text-xl font-bold bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
                TagAlong
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Connect with travelers going your way. Ship your items affordably and sustainably.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" aria-label="Facebook" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" aria-label="Twitter" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" aria-label="Instagram" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-400 hover:text-teal-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-teal-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-teal-400 transition-colors">Find Trips</Link>
              </li>
              <li>
                <Link to="/listings/create" className="text-gray-400 hover:text-teal-400 transition-colors">List Your Trip</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-teal-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-teal-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-gray-400 hover:text-teal-400 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-teal-400 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-teal-400 transition-colors">Terms of Service</Link>
              </li>

              <li>
                <Link to="/help" className="text-gray-400 hover:text-teal-400 transition-colors">Help Center</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <a href='https://www.google.com/maps/place/Sampaarsh+Technology/@22.293808,70.7496163,17z/data=!3m1!4b1!4m6!3m5!1s0x3959cb002b3686bf:0xedcc7c19f52f02c6!8m2!3d22.293808!4d70.7521912!16s%2Fg%2F11lctx91mv?entry=ttu&g_ep=EgoyMDI1MDUxNS4xIKXMDSoASAFQAw%3D%3D'>
                <li className="flex items-start">
                  <MapPin size={18} className="text-teal-400 mt-1 mr-2 flex-shrink-0" />
                  <span className="text-gray-400">Sampaarsh Tech,Patidar Chowk,360007,Rajkot,Gujarat</span>
                </li>
              </a>
              <li className="flex items-center">
                <Phone size={18} className="text-teal-400 mr-2 flex-shrink-0" />
                <a href="tel:+1-555-123-4567" className="text-gray-400 hover:text-teal-400 transition-colors">+1 (555) 123-4567</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-teal-400 mr-2 flex-shrink-0" />
                <a href="mailto:tagalong.samparsh@gmail.com" className="text-gray-400 hover:text-teal-400 transition-colors">tagalong.samparsh@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {currentYear} TagAlong. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;