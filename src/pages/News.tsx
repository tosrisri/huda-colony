import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Bell } from 'lucide-react';
import './News.css'; // Import your CSS file for news styles

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  images: string[]; // Add images array
  members: {
    full_name: string | null;
  } | null;
}

function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          members (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        setError(error);
      } else {
        setNews(data);
      }
    };

    fetchNews();
  }, []);

  if (error) return <div>Error loading news: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Bell className="h-8 w-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">News & Announcements</h1>
        </div>

        <div className="space-y-8">
          {news.map((item) => (
            <article key={item.id} className="bg-white overflow-hidden rounded-lg shadow-md">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>Posted by {item.members?.full_name || 'Shree'}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(item.created_at), 'MMMM d, yyyy')}</span>
                </div>
                <div className="prose max-w-none">
                  {/* Split content by paragraphs and render with images */}
                  {item.content.split('\n').map((paragraph, index) => (
                    <React.Fragment key={index}>
                      {/* Display image after paragraph if available */}
                      {item.images && item.images[index] && (
                        <div className="my-6">
                          <img
                            src={item.images[index]}
                            alt={`Image ${index + 1} for ${item.title}`}
                            className="w-full h-auto rounded-lg"
                          />
                        </div>
                      )}
                      <p className="text-gray-600 leading-relaxed">{paragraph}</p>
                      
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </article>
          ))}

          {news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No news or announcements available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default News;