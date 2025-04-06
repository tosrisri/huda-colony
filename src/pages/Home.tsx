import React from 'react';
import { Calendar, Users, MessageSquare, Bell, Phone } from 'lucide-react';
import parkImage from '../assets/images/park.png';

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[500px]" 
        style={{
          backgroundImage: `url(${parkImage})`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="max-w-7xl mx-auto h-full flex items-center px-4 sm:px-6 lg:px-8">
            <div className="text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Huda Colony</h1>
              <p className="text-xl md:text-2xl mb-8">A peaceful and vibrant community for modern living</p>
              <a 
                href="/about" 
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Latest News & Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Bell className="h-8 w-8 mr-2 text-indigo-600" />
            Latest News & Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                    <span className="text-gray-600">March 15, 2024</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Meeting</h3>
                  <p className="text-gray-600">Join us for the monthly community meeting to discuss upcoming events and initiatives.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Members */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Users className="h-8 w-8 mr-2 text-indigo-600" />
            Welcome New Members
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md p-6 text-center">
                <img
                  src={`https://i.pravatar.cc/150?img=${item}`}
                  alt="Member"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="font-semibold">John Doe</h3>
                <p className="text-gray-600">Block A-123</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Members Speak */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <MessageSquare className="h-8 w-8 mr-2 text-indigo-600" />
            Members Speak
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={`https://i.pravatar.cc/150?img=${item + 4}`}
                    alt="Member"
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">Jane Smith</h3>
                    <p className="text-gray-600">Resident since 2020</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  "Living in Huda Colony has been a wonderful experience. The community is very supportive and the amenities are excellent."
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-12 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center">
            <Phone className="h-8 w-8 mr-2 text-indigo-600" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Security', number: '+91 98765-43210' },
              { title: 'Maintenance', number: '+91 98765-43211' },
              { title: 'Medical Emergency', number: '+91 98765-43212' },
            ].map((contact, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{contact.title}</h3>
                <p className="text-indigo-600 text-lg font-medium">{contact.number}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;