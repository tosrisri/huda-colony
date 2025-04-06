import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';

interface GalleryItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
}

function Gallery() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*');

      if (error) {
        console.error('Error fetching images:', error);
        setError(error);
      } else {
        console.log('Fetched images data:', data);
        console.log('Response from Supabase:', { data, error });
        setImages(data);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Gallery</h1>
        
        {error && <div>Error loading images: {error.message}</div>}

        <PhotoProvider>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <PhotoView src={image.image_url}>
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 cursor-pointer">
                    <img
                      src={image.image_url}
                      alt={image.title}
                      className="object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white font-medium">{image.title}</h3>
                    </div>
                  </div>
                </PhotoView>
              </div>
            ))}
          </div>
        </PhotoProvider>

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No images available in the gallery.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Gallery;