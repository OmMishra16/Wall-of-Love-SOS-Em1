# Wall of Love ❤️

A collaborative visual canvas web app for showcasing screenshots and quotes from users. Built with React, FastAPI, and MongoDB.

## Features

### Core Functionality
- **Public View**: Anyone can view the wall without authentication
- **Edit Mode**: Authenticated users can add, edit, and arrange items
- **Dual Content Types**:
  - Image uploads with captions (screenshots of user feedback)
  - Sticky notes with customizable colors (text messages)
- **Real-time Updates**: Auto-refresh every 30 seconds in view mode
- **Share Link**: Easy sharing of your wall with others

### User Roles
1. **Viewers (Public)**: Can view the wall without signing in
2. **Editors (Authenticated)**: Can add, edit, move, and delete items

## Tech Stack

### Frontend
- **React 18** with React Router for navigation
- **Tailwind CSS** for styling (Inter font)
- **Axios** for API calls
- **JWT** for authentication

### Backend
- **FastAPI** for API endpoints
- **MongoDB** for data storage
- **JWT** authentication
- **Local file storage** for uploaded images

## Getting Started

### Start Services
```bash
sudo supervisorctl restart all
```

### Access the Application
- **Frontend**: https://25263fd2-d606-409b-a4fc-4f489ddf47cd.preview.emergentagent.com
- **Backend API**: https://25263fd2-d606-409b-a4fc-4f489ddf47cd.preview.emergentagent.com/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Wall Items
- `GET /api/items` - Get all items (public)
- `POST /api/items` - Create new item (protected)
- `PUT /api/items/{id}` - Update item (protected)
- `DELETE /api/items/{id}` - Delete item (protected)

### File Upload
- `POST /api/upload` - Upload image (protected)

## Usage Guide

### For Founders (Editors)

1. **Sign Up/Login**
   - Navigate to `/register` to create an account
   - Or `/login` if you already have an account

2. **Add Content**
   - Click "Add Image" to upload a screenshot
   - Click "Add Note" to create a sticky note with customizable colors

3. **Edit Items**
   - Toggle to "Edit Mode" using the view/edit buttons
   - Click edit icons on items to modify content
   - Click delete icons to remove items

4. **Share Your Wall**
   - Click "Copy Share Link" to share with others
   - No authentication needed for viewers

## Testing

Backend API tests: ✅ **18/18 tests passed (100% success rate)**

```bash
python3 /app/backend_test.py
```

---

**Built with ❤️ using Emergent AI Agent**
