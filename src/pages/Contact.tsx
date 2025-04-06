import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { MapPin, Phone, Mail, Send } from 'lucide-react';

function Contact() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return;

    setSubmitStatus('loading');
    try {
      const { error } = await supabase
        .from('issues')
        .insert([
          {
            title,
            description,
            member_id: supabase.auth.getUser(), // This will be set by RLS
          }
        ]);

      if (error) throw error;

      setSubmitStatus('success');
      setTitle('');
      setDescription('');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting issue:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Office Location</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                  <div>
                    <p className="text-gray-600">
                      Huda Colony Office<br />
                      123 Main Street<br />
                      City, State 12345
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-indigo-600 mr-3" />
                  <p className="text-gray-600">+91 123-456-7890</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-6 w-6 text-indigo-600 mr-3" />
                  <p className="text-gray-600">info@hudacolony.com</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Map</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.2!2d78.4!3d17.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDI0JzAwLjAiTiA3OMKwMjQnMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                  className="w-full h-full rounded-lg"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit an Issue or Concern</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Brief title for your issue"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Please describe your issue or concern in detail..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submitStatus === 'loading'}
                className="flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {submitStatus === 'loading' ? (
                  'Submitting...'
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit
                  </>
                )}
              </button>

              {submitStatus === 'success' && (
                <p className="text-green-600 text-center">Issue submitted successfully!</p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-600 text-center">Error submitting issue. Please try again.</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;