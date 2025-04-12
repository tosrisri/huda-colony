import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PenTool as Tool, Send } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  contact_info: string;
  phone_number: string; // Updated field
  business_image: string; // Updated field
}

function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<string>('');
  const [description, setDescription] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, name, description, contact_info, phone_number, business_image'); // Fetch new fields

        if (error) {
          console.error('Error fetching services:', error);
          setError(error);
        } else {
          console.log('Fetched services data:', data);
          setServices(data);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !description) return;

    setSubmitStatus('loading');
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error fetching user:', userError);
        setSubmitStatus('error');
        return;
      }

      if (!user) {
        console.error('User is not authenticated');
        setSubmitStatus('error');
        return;
      }

      const { data, error } = await supabase
        .from('service_requests')
        .insert([
          {
            service_id: selectedService,
            description,
            member_id: user.id,
          }
        ]);

      if (error) {
        console.error('Error submitting service request:', error);
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      } else {
        console.log('Service request submitted successfully:', data);
        setSubmitStatus('success');
        setSelectedService('');
        setDescription('');
        setTimeout(() => setSubmitStatus('idle'), 3000);
      }
    } catch (error) {
      console.error('Error submitting service request:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  }

  if (error) return <div>Error loading services: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Tool className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        </div>

        {/* Services Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow-md p-6">
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">S. No</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Service Type</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Contact Name</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Phone Number</th>
                <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Business Identity</th>
              </tr>
            </thead>
            <tbody>
              {services
                .sort((a, b) => a.name.localeCompare(b.name)) // Sort services alphabetically
                .map((service, index) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    {/* Serial Number */}
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">{index + 1}</td>

                    {/* Service Type */}
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">{service.name}</td>

                    {/* Description */}
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                      <ul className="list-disc list-inside">
                        {service.description.split('*').map((item, idx) => (
                          item.trim() && <li key={idx}>{item.trim()}</li>
                        ))}
                      </ul>
                    </td>

                    {/* Contact Name */}
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                      {service.contact_info.split('+')[0].trim()}
                    </td>

                    {/* Phone Number */}
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-600">
                      {service.phone_number}
                    </td>

                    {/* Business Identity */}
                    <td className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                      <img
                        src={service.business_image}
                        alt={service.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </td>
                  </tr>
                ))}
              {services.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No services available at the moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Service Request Form */}
        <div className="rounded-lg shadow-md p-6 bg-[#f9ebff] mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Request a Service</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                Select Service
              </label>
              <select
                id="service"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a service...</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Please describe your service request..."
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
                  Submit Request
                </>
              )}
            </button>

            {submitStatus === 'success' && (
              <p className="text-green-600 text-center">Service request submitted successfully!</p>
            )}
            {submitStatus === 'error' && (
              <p className="text-red-600 text-center">Error submitting service request. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Services;