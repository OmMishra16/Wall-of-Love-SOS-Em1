import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Header({ isEditMode, isAuthenticated, onToggleMode, onAddImage, onAddSticky, onCopyLink }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-slate-200/50 bg-background-light/80 p-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-bold tracking-tight text-slate-900">Wall of Love ❤️</h2>
      </div>

      <div className="flex items-center gap-2">
        {isAuthenticated && (
          <>
            <button
              onClick={onAddImage}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
              <span className="hidden sm:inline">Add Image</span>
            </button>

            <button
              onClick={onAddSticky}
              className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-amber-500 px-4 text-sm font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">note_add</span>
              <span className="hidden sm:inline">Add Note</span>
            </button>
          </>
        )}

        <div className="flex items-center gap-1 rounded-xl bg-slate-200/60 p-1">
          <button
            onClick={onToggleMode}
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              !isEditMode ? 'bg-white shadow-sm' : ''
            }`}
            title="View Mode"
          >
            <span className="material-symbols-outlined text-lg text-slate-600">
              visibility
            </span>
          </button>
          <button
            onClick={onToggleMode}
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isEditMode ? 'bg-white shadow-sm' : ''
            }`}
            title="Edit Mode"
          >
            <span className="material-symbols-outlined text-lg text-slate-600">
              edit
            </span>
          </button>
        </div>

        <button
          onClick={onCopyLink}
          className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-200/60 px-4 text-sm font-bold text-slate-800 shadow-sm transition-transform hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-xl">link</span>
          <span className="hidden sm:inline">Copy Share Link</span>
        </button>

        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-200/60 px-4 text-sm font-bold text-slate-800 shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex h-10 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-slate-200/60 px-4 text-sm font-bold text-slate-800 shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined text-xl">login</span>
            <span className="hidden sm:inline">Login</span>
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;