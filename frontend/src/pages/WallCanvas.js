import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Header from '../components/Header';
import ImageCard from '../components/ImageCard';
import StickyNote from '../components/StickyNote';
import AddImageModal from '../components/AddImageModal';
import AddStickyModal from '../components/AddStickyModal';

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

function WallCanvas() {
  const { token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAddImageModal, setShowAddImageModal] = useState(false);
  const [showAddStickyModal, setShowAddStickyModal] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  // Fetch items from backend
  const fetchItems = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    
    // Auto-refresh every 30 seconds for view mode
    const interval = setInterval(() => {
      if (!isEditMode) {
        fetchItems();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [fetchItems, isEditMode]);

  const handleAddImage = async (file, caption) => {
    if (!token) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Upload image
      const uploadResponse = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Create item
      const imageUrl = uploadResponse.data.url;
      const newItem = {
        type: 'image',
        image_url: imageUrl,
        caption: caption || '',
        position: {
          gridColumn: Math.floor(Math.random() * 5) + 1,
          gridRow: Math.floor(Math.random() * 3) + 1
        }
      };

      const response = await axios.post(`${API_URL}/api/items`, newItem, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setItems([...items, response.data]);
      setShowAddImageModal(false);
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Failed to upload image');
    }
  };

  const handleAddSticky = async (content, backgroundColor) => {
    if (!token) return;

    const newItem = {
      type: 'sticky',
      content: content,
      background_color: backgroundColor,
      position: {
        gridColumn: Math.floor(Math.random() * 5) + 1,
        gridRow: Math.floor(Math.random() * 3) + 1
      }
    };

    try {
      const response = await axios.post(`${API_URL}/api/items`, newItem, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setItems([...items, response.data]);
      setShowAddStickyModal(false);
    } catch (error) {
      console.error('Error adding sticky note:', error);
      alert('Failed to add sticky note');
    }
  };

  const handleUpdateItem = async (itemId, updates) => {
    if (!token) return;

    try {
      const response = await axios.put(`${API_URL}/api/items/${itemId}`, updates, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setItems(items.map(item => item.id === itemId ? response.data : item));
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!token) return;

    try {
      await axios.delete(`${API_URL}/api/items/${itemId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCopyShareLink = () => {
    const url = window.location.href.split('?')[0];
    navigator.clipboard.writeText(url);
    alert('Share link copied to clipboard!');
  };

  const handleDragStart = (e, item) => {
    if (!isEditMode) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden font-display bg-background-light text-slate-800">
      <Header
        isEditMode={isEditMode}
        isAuthenticated={isAuthenticated}
        onToggleMode={() => {
          if (isAuthenticated) {
            setIsEditMode(!isEditMode);
          } else {
            navigate('/login');
          }
        }}
        onAddImage={() => {
          if (isAuthenticated) {
            setShowAddImageModal(true);
          } else {
            navigate('/login');
          }
        }}
        onAddSticky={() => {
          if (isAuthenticated) {
            setShowAddStickyModal(true);
          } else {
            navigate('/login');
          }
        }}
        onCopyLink={handleCopyShareLink}
      />

      <main className="flex-1 overflow-auto canvas-bg cursor-grab active:cursor-grabbing">
        <div className="relative min-h-full w-full p-8 pt-24 md:p-16 md:pt-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {items.map((item, index) => (
              <div
                key={item.id}
                draggable={isEditMode}
                onDragStart={(e) => handleDragStart(e, item)}
                onDragEnd={handleDragEnd}
                className={`card-enter ${draggedItem?.id === item.id ? 'dragging' : ''}`}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                {item.type === 'image' ? (
                  <ImageCard
                    item={item}
                    isEditMode={isEditMode}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                ) : (
                  <StickyNote
                    item={item}
                    isEditMode={isEditMode}
                    onUpdate={handleUpdateItem}
                    onDelete={handleDeleteItem}
                  />
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold text-slate-400 mb-4">Your Wall of Love is empty</h2>
              <p className="text-slate-500 mb-8">
                {isAuthenticated 
                  ? "Start adding screenshots and messages to showcase your user love!"
                  : "Sign in to start building your wall"}
              </p>
              {isAuthenticated && (
                <button
                  onClick={() => setShowAddImageModal(true)}
                  className="bg-primary text-white font-bold py-3 px-6 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-sm"
                >
                  Add Your First Image
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {showAddImageModal && (
        <AddImageModal
          onClose={() => setShowAddImageModal(false)}
          onAdd={handleAddImage}
        />
      )}

      {showAddStickyModal && (
        <AddStickyModal
          onClose={() => setShowAddStickyModal(false)}
          onAdd={handleAddSticky}
        />
      )}
    </div>
  );
}

export default WallCanvas;
