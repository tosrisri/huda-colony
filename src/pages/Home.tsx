import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar, Users, MessageSquare, Bell, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../index.css'; // Import your global CSS file
import './Home.css'; // Import your CSS file for flip card styles
import Spline from '@splinetool/react-spline';

interface NewsItem {
  id: string;
  title: string;
  created_at: string;
  content: string;
  images: string[]; // Add images array
}

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  block_number: string;
  is_executive: boolean;
  photo?: string; // Updated to match the column name in the database
}

function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    // Fetch Latest News
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching news:', error);
      } else {
        setNews(data || []);
      }
    };

    // Fetch Recently Added Members
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('members')
        .select('id, full_name, email, phone, block_number, is_executive, photo') // Updated to use 'photo'
        .order('created_at', { ascending: false })
        .limit(3);

      if (error) {
        console.error('Error fetching members:', error);
      } else {
        setMembers(data || []);
      }
    };

    fetchNews();
    fetchMembers();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full h-[75vh]">
      <Spline scene="https://prod.spline.design/9I7QKPhih4hdT2r8/scene.splinecode" />
    </section>   
       
      

      {/* Latest News & Events */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center hc-tcolor-dark">
            <Bell className="h-8 w-8 mr-2 hc-tcolor-dark" />
            Latest News & Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.length > 0 ? (
              news.map((item) => (
                <div key={item.id} className="cards-bg rounded-lg shadow-md overflow-hidden">
                  {item.images && item.images[0] && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={item.images[2]}
                        alt={`Preview for ${item.title}`}
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Calendar className="h-5 w-5 hc-tcolor-dark mr-2" />
                      <span className="text-gray-600">
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 hc-tcolor-dark">{item.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {item.content.length > 150 
                        ? `${item.content.substring(0, 150)}...` 
                        : item.content
                      }
                    </p>
                    <Link 
                      to={`/news`} 
                      className="text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No news or events available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Welcome New Members */}
      <section className="section-wrapper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8 flex items-center">
            <Users className="h-8 w-8 mr-2" />
            Welcome New Members
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.length > 0 ? (
              members.map((member) => (
                <div key={member.id} className="flip-card">
                  <div className="flip-card-inner">
                    {/* Front Side */}
                    <div className="flip-card-front bg-white rounded-lg shadow-md p-6 text-center">
                      <img
                        src={member.photo || `https://i.pravatar.cc/150?u=${member.id}`}
                        alt={member.full_name}
                        className="w-24 h-24 rounded-full mx-auto mb-4"
                      />
                      <h3 className="font-semibold text-lg">{member.full_name}</h3>
                    </div>
                    {/* Back Side */}
                    <div className="flip-card-back hc-bgcolor-dark text-white rounded-lg shadow-md p-6 text-center">
                      <h3 className="font-semibold text-lg">{member.full_name}</h3>
                      <p className="text-gray-200">Block: {member.block_number}</p>
                      <p className="text-gray-200">Email: {member.email}</p>
                      <p className="text-gray-200">Phone: {member.phone}</p>
                      {member.is_executive && (
                        <span className="text-sm font-medium">Executive Member</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No new members to display.</p>
            )}
          </div>
        </div>
      </section>

      {/* Members Speak */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold hc-tcolor-dark mb-8 flex items-center">
            <MessageSquare className="h-8 w-8 mr-2 hc-tcolor-dark" />
            Members Speak
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="cards-bg rounded-lg shadow-md p-6">
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
      <section className="py-12 bg-[#F7EEE5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold hc-tcolor-dark mb-8 flex items-center">
            <Phone className="h-8 w-8 mr-2 hc-tcolor-dark" />
            Emergency Contacts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Security', number: '+91 98765-43210' },
              { title: 'Maintenance', number: '+91 98765-43211' },
              { title: 'Medical Emergency', number: '+91 98765-43212' },
            ].map((contact, index) => (
              <div key={index} className="shadow-inner rounded-lg inset-6 p-6">
                <h3 className="text-xl font-semibold mb-2">{contact.title}</h3>
                <p className="hc-tcolor-dark text-lg font-medium">{contact.number}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;