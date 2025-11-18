import React, { useState } from 'react';
import ImageLightbox from './ImageLightbox';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function ImageCard({ item, isEditMode, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(item.caption || '');
  const [showLightbox, setShowLightbox] = useState(false);

  const handleSaveCaption = () => {
    onUpdate(item.id, { caption });
    setIsEditing(false);
  };

  return (
    <>
      <div className="flex flex-col gap-3 transition-transform duration-300 ease-in-out hover-scale">
        <div 
          className="relative w-full overflow-hidden rounded-2xl bg-white shadow-soft cursor-pointer group"
          onClick={() => !isEditMode && setShowLightbox(true)}
        >
          <img
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            src={`${API_URL}${item.image_url}`}
            alt={item.caption || 'User feedback'}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x500?text=Image+Not+Found';
            }}
          />
          
          {/* Hover overlay with zoom icon */}
          {!isEditMode && (
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-6xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                zoom_in
              </span>
            </div>
          )}
        
          {isEditMode && (
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="bg-white rounded-lg p-2 shadow-md hover:bg-slate-100 transition"
                title="Edit caption"
              >
                <span className="material-symbols-outlined text-sm text-slate-600">edit</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Delete this item?')) {
                    onDelete(item.id);
                  }
                }}
                className="bg-white rounded-lg p-2 shadow-md hover:bg-red-50 transition"
                title="Delete"
              >
                <span className="material-symbols-outlined text-sm text-red-600">delete</span>
              </button>
            </div>
          )}
        </div>

      {isEditing ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="flex-1 px-3 py-1 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
            placeholder="Add a caption..."
            autoFocus
          />
          <button
            onClick={handleSaveCaption}
            className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90"
          >
            Save
          </button>
        </div>
      ) : (
        item.caption && (
          <p className="text-center text-sm font-medium text-slate-600">
            {item.caption}
          </p>
        )
      )}
    </div>
  );
}

export default ImageCard;