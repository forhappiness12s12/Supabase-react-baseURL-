// src/ImageDisplay.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ImageDisplay = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log('Fetching files from the bucket...');
        const { data, error } = await supabase
          .storage
          .from('im') // Ensure this matches your bucket name exactly
          .list('', { limit: 100 }); // Adjust the limit as needed

        if (error) {
          console.error('Error listing files:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.log('No files found in the bucket.');
          return;
        }

        console.log('Files found:', data);

        const baseUrl = 'https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/im/';

        // Manually construct the public URLs
        const imageUrls = data.map((file) => {
          const publicURL = `${baseUrl}${file.name}`;
          console.log(`Public URL for ${file.name}: ${publicURL}`);
          return publicURL;
        });

        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Display PNG Images</h1>
      <div>
        {images.length > 0 ? (
          images.map((url, index) => (
            <img key={index} src={url} alt={`Image ${index}`} style={{ width: '200px', margin: '10px' }} />
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;
