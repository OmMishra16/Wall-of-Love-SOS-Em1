import React, { useState } from 'react';

function StickyNote({ item, isEditMode, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(item.content || '');

  const handleSaveContent = () => {
    onUpdate(item.id, { content });
    setIsEditing(false);
  };

  const bgColorClass = item.background_color || 'bg-sky-100';
  const textColorClass = item.background_color?.includes('sky') ? 'text-sky-800' :
    item.background_color?.includes('pink') ? 'text-pink-800' :
    item.background_color?.includes('amber') ? 'text-amber-800' :
    item.background_color?.includes('lime') ? 'text-lime-800' :
    'text-slate-800';

  return (
    <div className="flex flex-col gap-3 transition-transform duration-300 ease-in-out hover-scale">
      <div className={`relative w-full aspect-square overflow-hidden rounded-xl ${bgColorClass} p-6 shadow-soft`}>
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={`w-full h-full text-lg font-medium ${textColorClass} bg-transparent border border-slate-300 rounded-lg p-2 resize-none focus:ring-2 focus:ring-primary outline-none`}
            autoFocus
          />
        ) : (
          <p className={`text-lg font-medium ${textColorClass}`}>
            {item.content}
          </p>
        )}

        {isEditMode && (
          <div className="absolute top-2 right-2 flex gap-2">
            {isEditing ? (
              <button
                onClick={handleSaveContent}
                className="bg-white rounded-lg p-2 shadow-md hover:bg-slate-100 transition"
                title="Save"
              >
                <span className="material-symbols-outlined text-sm text-green-600">check</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="bg-white rounded-lg p-2 shadow-md hover:bg-slate-100 transition"
                title="Edit"
              >
                <span className="material-symbols-outlined text-sm text-slate-600">edit</span>
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this note?')) {
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
    </div>
  );
}

export default StickyNote;