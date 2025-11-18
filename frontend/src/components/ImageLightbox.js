import React, { useEffect } from 'react';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function ImageLightbox({ item, onClose }) {
  useEffect(() => {
    // Close on Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-overlay animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative max-w-5xl max-h-[90vh] w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
          title="Close (Esc)"
        >
          <span className="material-symbols-outlined text-4xl">close</span>
        </button>

        {/* Image container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          <img
            src={`${API_URL}${item.image_url}`}
            alt={item.caption || 'User feedback'}
            className="w-full h-auto max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
            }}
          />
        </div>

        {/* Caption */}
        {item.caption && (
          <div className="mt-4 text-center">
            <p className="text-white text-lg font-medium px-4 py-2 bg-black/30 rounded-xl backdrop-blur-sm inline-block">
              {item.caption}
            </p>
          </div>
        )}

        {/* Navigation hint */}
        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Press <kbd className="px-2 py-1 bg-gray-700 rounded text-white text-xs">Esc</kbd> or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImageLightbox;
