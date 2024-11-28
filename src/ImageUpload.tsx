import React, { useState } from 'react';

const ImageUpload = ({ onImageUpload }: { onImageUpload: (image: File) => void }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const imageFile = event.target.files[0];
      setSelectedImage(imageFile);
      onImageUpload(imageFile);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {selectedImage && <p>{selectedImage.name}</p>}
    </div>
  );
};

export default ImageUpload;
