// src/ImageDisplay.js
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ImageDisplay = () => {
  const [images, setImages] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    const filePath = `${selectedFile.name}`;
    const { data, error } = await supabase
      .storage
      .from('im') // Ensure this matches your bucket name exactly
      .upload(filePath, selectedFile);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    console.log('File uploaded:', data);

    // Update the images list with the new image URL
    const newImageUrl = `https://krvevkxigsdnikvakxjt.supabase.co/storage/v1/object/public/im/${filePath}`;
    setImages((prevImages) => [...prevImages, newImageUrl]);
  };

  const handleImageSelect = (url) => {
    setSelectedImage(url);
  };

  const handleDelete = async () => {
    if (!selectedImage) {
      alert('Please select an image to delete');
      return;
    }

    // Extract the file name from the URL
    const fileName = selectedImage.split('/').pop();

    const { error } = await supabase
      .storage
      .from('im') // Ensure this matches your bucket name exactly
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      return;
    }

    console.log('File deleted:', selectedImage);

    // Update the images list to remove the deleted image
    setImages((prevImages) => prevImages.filter((url) => url !== selectedImage));
    setSelectedImage(null); // Clear the selected image
  };

  return (
    <div>
      <h1>Display PNG Images</h1>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
      <div>
        {images.length > 0 ? (
          images.map((url, index) => (
            <div key={index} style={{ display: 'inline-block', margin: '10px' }}>
              <img
                src={url}
                alt={`Image ${index}`}
                style={{
                  width: '200px',
                  border: selectedImage === url ? '2px solid red' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => handleImageSelect(url)}
              />
            </div>
          ))
        ) : (
          <p>No images found.</p>
        )}
      </div>
      {selectedImage && (
        <div>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
