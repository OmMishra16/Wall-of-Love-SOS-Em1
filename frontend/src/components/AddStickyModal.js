import React, { useState } from 'react';

const COLORS = [
  { name: 'Sky Blue', class: 'bg-sky-100', value: 'bg-sky-100' },
  { name: 'Pink', class: 'bg-pink-100', value: 'bg-pink-100' },
  { name: 'Amber', class: 'bg-amber-100', value: 'bg-amber-100' },
  { name: 'Lime', class: 'bg-lime-100', value: 'bg-lime-100' },
  { name: 'Purple', class: 'bg-purple-100', value: 'bg-purple-100' },
];

function AddStickyModal({ onClose, onAdd }) {
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    await onAdd(content, selectedColor);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-overlay" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Add Sticky Note</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Message
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
              placeholder="Write your message here..."
              rows="4"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-12 h-12 rounded-xl ${color.class} border-2 ${
                    selectedColor === color.value ? 'border-primary' : 'border-transparent'
                  } hover:scale-110 transition-transform`}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim() || loading}
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Adding...' : 'Add Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStickyModal;