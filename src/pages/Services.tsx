import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PenTool as Tool, Send } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description: string;
  contact_info: string;
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
          .select('*');

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

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold">{service.name}</h3>
              <p className="text-gray-600">{service.description}</p>
              <p className="text-gray-500">Contact: {service.contact_info}</p>
            </div>
          ))}
          {services.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No services available at the moment.</p>
            </div>
          )}
        </div>

        {/* Service Request Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
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