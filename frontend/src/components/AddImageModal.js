import React, { useState } from 'react';

function AddImageModal({ onClose, onAdd }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      alert('Please select a valid image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      processFile(droppedFile);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        processFile(blob);
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    await onAdd(file, caption);
    setLoading(false);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 modal-overlay" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-soft p-8 max-w-md w-full" 
        onClick={(e) => e.stopPropagation()}
        onPaste={handlePaste}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Add Image</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block w-full">
              <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
                  isDragging 
                    ? 'border-primary bg-primary/5' 
                    : 'border-slate-300 hover:border-primary'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setFile(null);
                        setPreview(null);
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                    >
                      <span className="material-symbols-outlined text-sm text-red-600">close</span>
                    </button>
                  </div>
                ) : (
                  <div>
                    <span className="material-symbols-outlined text-6xl text-slate-400 mb-2">upload_file</span>
                    <p className="text-slate-600 font-medium">Click, drag & drop, or paste image</p>
                    <p className="text-slate-400 text-sm mt-1">PNG, JPG, GIF up to 10MB</p>
                    <p className="text-slate-500 text-xs mt-2">💡 Tip: You can also press Ctrl+V (Cmd+V) to paste</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Caption (optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              placeholder="e.g., Made my day!"
            />
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
              disabled={!file || loading}
              className="flex-1 px-4 py-3 bg-primary text-white font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Uploading...' : 'Add Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddImageModal;