import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Bell, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import './News.css';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  created_at: string;
  images: string[];
  members: {
    full_name: string | null;
  } | null;
}

const ITEMS_PER_PAGE = 3;

function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error, count } = await supabase
        .from('news')
        .select(`
          *,
          members (
            full_name
          )
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching news:', error);
        setError(error);
      } else {
        setNews(data || []);
        setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
      }
    };

    fetchNews();
  }, []);

  // Get current news items
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentNews = news.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) return <div>Error loading news: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Bell className="h-8 w-8 mr-3 brand-color" />
          <h1 className="text-3xl font-bold">News & Announcements</h1>
        </div>

        <div className="space-y-8">
          {currentNews.map((item) => (
            <article key={item.id} className="">
              <div className="p-8">
                {/* Header */}
                <h2 className="text-2xl font-bold mb-2">{item.title}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-6">
                  <span>Posted by {item.members?.full_name || 'Shree'}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(item.created_at), 'MMMM d, yyyy')}</span>
                </div>

                {/* Featured Image */}
                {item.images && item.images[0] && (
                  <div className="mb-6">
                    <img
                      src={item.images[0]}
                      alt={`Featured image for ${item.title}`}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="prose max-w-none">
                  {item.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="text-gray-600 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Image Gallery - if there are additional images */}
                {item.images && item.images.length > 1 && (
                  <div className="mt-8">
                    <div className="flex items-center mb-4">
                      <ImageIcon className="h-5 w-5 text-indigo-600 mr-2" />
                      <h3 className="text-lg font-semibold">Image Gallery</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {item.images.slice(1).map((image, index) => (
                        <div key={index} className="aspect-w-16 aspect-h-9">
                          <img
                            src={image}
                            alt={`Additional image ${index + 1} for ${item.title}`}
                            className="w-full h-48 object-cover rounded-lg shadow-sm hover:opacity-75 transition-opacity cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}

          {news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No news or announcements available.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                  <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-3 py-2 border rounded-md text-sm font-medium ${
                      currentPage === number
                        ? 'bg-brand-color text-white border-orange-950'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {number}
                  </button>
                ))}
              </div>

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default News;