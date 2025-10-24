import React, { useRef } from 'react';

const ImageUpload = ({ images, setImages, maxImages = 5, disabled = false }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (images.length + validFiles.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const getImagePreview = (file) => {
    return URL.createObjectURL(file);
  };

  return (
    <div className="image-upload-container">
      <div className="upload-area">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          disabled={disabled || images.length >= maxImages}
          className="file-input"
          id="image-upload"
        />
        
        <label 
          htmlFor="image-upload" 
          className={`upload-label ${disabled || images.length >= maxImages ? 'disabled' : ''}`}
        >
          <div className="upload-content">
            <span className="upload-text">
              {images.length >= maxImages 
                ? `Maximum ${maxImages} images reached`
                : `Click to upload images (${images.length}/${maxImages})`
              }
            </span>
            <span className="upload-hint">
              JPG, PNG up to 5MB each
            </span>
          </div>
        </label>
      </div>

      {images.length > 0 && (
        <div className="image-previews">
          {images.map((image, index) => (
            <div key={index} className="image-preview">
              <img 
                src={getImagePreview(image)} 
                alt={`Preview ${index + 1}`}
                className="preview-image"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="remove-image-btn"
                disabled={disabled}
              >
                ×
              </button>
              <div className="image-info">
                <span className="image-name">{image.name}</span>
                <span className="image-size">
                  {(image.size / 1024 / 1024).toFixed(1)}MB
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;