import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-indigo-400">About Us</a></li>
              <li><a href="/news" className="hover:text-indigo-400">News & Events</a></li>
              <li><a href="/gallery" className="hover:text-indigo-400">Gallery</a></li>
              <li><a href="/contact" className="hover:text-indigo-400">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Emergency Contacts</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Police: 100
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Ambulance: 102
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Fire: 101
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Huda Colony Office, Main Street
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                +91 123-456-7890
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                info@hudacolony.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Huda Colony. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;