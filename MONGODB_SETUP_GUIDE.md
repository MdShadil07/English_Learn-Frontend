# MongoDB User Search Implementation Guide

## Overview
Your frontend is already correctly configured to call the search endpoints at `http://localhost:5000/api`. You just need to implement the two missing endpoints in your Express backend.

## Quick Start ⚡

### Required Backend Endpoints:
1. **GET** `/api/user/search?q={query}` - Search users by name, email, or username
2. **GET** `/api/user/:userId/public-profile` - Get public profile for a specific user

Both endpoints are already defined in your API configuration but missing from your backend implementation.

---

## Step-by-Step Implementation

### Step 1: Add Routes to Your Backend

In your Express backend (wherever you define your routes, likely in a file like `routes/user.js` or `server.js`):

```javascript
import express from 'express';
import mongoose from 'mongoose';
import { authenticateToken } from './middleware/auth.js'; // Your auth middleware

const router = express.Router();
const db = mongoose.connection.db; // Or use your MongoDB client

/**
 * GET /api/user/search?q={query}
 * Search for users by fullName, email, or username (case-insensitive)
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query (q) is required',
        data: [],
      });
    }

    const searchQuery = q.trim();
    const limit = 10;

    // MongoDB case-insensitive search
    const users = await db.collection('users').find({
      $or: [
        { fullName: { $regex: searchQuery, $options: 'i' } },
        { email: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } },
      ],
    })
    .project({
      _id: 1,
      email: 1,
      fullName: 1,
      username: 1,
      avatarUrl: 1,
      level: 1,
      role: 1,
      subscriptionStatus: 1,
      bio: 1,
      currentStreak: 1,
      xpTotal: 1,
    })
    .limit(limit)
    .toArray();

    // Transform to match frontend expectations
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      fullName: user.fullName || '',
      email: user.email || '',
      avatar: user.avatarUrl || null,
      level: user.level || 0,
      role: user.role || 'student',
      subscriptionStatus: user.subscriptionStatus || 'free',
      bio: user.bio || '',
      location: user.location || '',
      skills: user.skills || [],
      currentStreak: user.currentStreak || 0,
      totalXP: user.xpTotal || 0,
      totalSessions: user.sessions || 0,
      joinedDate: user.joinedDate || user.createdAt,
    }));

    console.log(`🔍 Search for "${searchQuery}" found ${transformedUsers.length} users`);

    res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: transformedUsers,
    });
  } catch (error) {
    console.error('❌ User search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching users',
      data: [],
    });
  }
});

/**
 * GET /api/user/:userId/public-profile
 * Get public profile of a specific user
 */
router.get('/:userId/public-profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format',
        data: null,
      });
    }

    // Query MongoDB
    const user = await db.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
        data: null,
      });
    }

    // Transform response
    const publicProfile = {
      id: user._id.toString(),
      fullName: user.fullName || 'Unknown User',
      email: user.email || '',
      avatar: user.avatarUrl || null,
      level: user.level || 0,
      role: user.role || 'student',
      subscriptionStatus: user.subscriptionStatus || 'free',
      bio: user.bio || '',
      location: user.location || '',
      skills: user.skills || [],
      achievements: user.achievements || '',
      currentStreak: user.currentStreak || 0,
      totalXP: user.xpTotal || 0,
      totalSessions: user.sessions || 0,
      joinedDate: user.joinedDate || user.createdAt,
    };

    console.log(`✅ Retrieved profile: ${publicProfile.fullName}`);

    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: publicProfile,
    });
  } catch (error) {
    console.error('❌ Public profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user profile',
      data: null,
    });
  }
});

export default router;
```

### Step 2: Register Routes in Your Server

In your main server file (e.g., `server.js` or `index.js`):

```javascript
import userRoutes from './routes/user.js';

// Register routes BEFORE app.listen()
app.use('/api/user', userRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server started successfully!`);
  console.log(`📍 Running on: http://localhost:${PORT}`);
  console.log(`📊 API Base URL: http://localhost:${PORT}/api`);
});
```

### Step 3: Verify MongoDB Collection Structure

Your `users` collection must have these fields:

```javascript
{
  _id: ObjectId,                    // MongoDB ID
  email: String,                    // Required for search
  fullName: String,                 // Required for search
  username: String,                 // Optional, used in search
  avatarUrl: String,                // Avatar image link (frontend calls it 'avatar')
  level: Number,                    // User level
  role: String,                     // 'student', 'teacher', 'admin'
  subscriptionStatus: String,       // 'free', 'basic', 'premium', 'pro'
  
  // Additional fields (optional but recommended)
  bio: String,                      // User bio
  location: String,                 // Location
  skills: [String],                 // Array of skills
  achievements: String,             // Achievements
  currentStreak: Number,            // Daily streak count
  xpTotal: Number,                  // Total XP points
  sessions: Number,                 // Total learning sessions
  joinedDate: Date,                 // Account creation date
  createdAt: Date,                  // MongoDB timestamp
  updatedAt: Date                   // MongoDB timestamp
}
```

---

## Testing

### Test Search Endpoint

**Using Browser Console:**
```javascript
const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
fetch('http://localhost:5000/api/user/search?q=john', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Search completed successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "fullName": "John Doe",
      "email": "john@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "level": 5,
      "role": "student",
      "subscriptionStatus": "premium",
      "bio": "Learning English",
      "currentStreak": 7,
      "totalXP": 1500
    }
  ]
}
```

### Test Profile Endpoint

**Using Browser Console:**
```javascript
const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
const userId = '507f1f77bcf86cd799439011'; // Replace with actual user ID

fetch(`http://localhost:5000/api/user/${userId}/public-profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log(data));
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile retrieved successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "fullName": "John Doe",
    "email": "john@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "level": 5,
    "role": "student",
    "subscriptionStatus": "premium",
    "bio": "Learning English",
    "location": "New York",
    "skills": ["grammar", "vocabulary"],
    "achievements": "Streak Master",
    "currentStreak": 7,
    "totalXP": 1500,
    "totalSessions": 42,
    "joinedDate": "2024-01-15T10:00:00Z"
  }
}
```

---

## Frontend Testing

Once your backend endpoints are ready:

1. **Open browser DevTools:** Press `F12` → Console tab
2. **Search in dashboard:** Type in the search bar
3. **Check console logs:**
   - 🔍 "Searching for: "
   - 📦 "API Response:"
   - ✅ "Found X results"
   - ❌ Any error messages
4. **Click on search result** → Should navigate to `/user-profile/{userId}`

---

## Field Name Mapping Reference

If your MongoDB uses different field names, update the mapping in the backend routes:

| MongoDB Field | Frontend Expects | Notes |
|---|---|---|
| `avatarUrl` | `avatar` | Avatar image URL/link |
| `xpTotal` | `totalXP` | Total XP points |
| `currentStreak` | `currentStreak` | Days of consecutive usage |
| `sessions` | `totalSessions` | Total learning sessions |

---

## Troubleshooting

### ❌ Got 404 Error
**Problem:** Routes not found
**Solution:** 
- Check routes are registered BEFORE `app.listen()`
- Verify endpoint paths: `/api/user/search` and `/api/user/:userId/public-profile`
- Restart backend server

### ❌ Got 401 Error
**Problem:** Authentication failed
**Solution:**
- Verify token is being sent in request headers
- Check `authenticateToken` middleware is working
- Make sure JWT secret matches in auth verification

### ❌ No Search Results
**Problem:** Search returns empty array
**Solution:**
- Check collection name is `'users'` (or update in queries)
- Verify field names match: `fullName`, `email`, `username`
- Check database has actual user data
- Try searching by email (most reliable)

### ❌ Avatar Not Showing
**Problem:** Avatar images don't appear
**Solution:**
- Ensure `avatarUrl` field is populated in MongoDB
- Check image URLs are accessible
- Verify frontend is looking for `avatar` field (the mapping handles this)

### ❌ Wrong Subscription Status
**Problem:** Subscription status showing as 'free' for all users
**Solution:**
- Check `subscriptionStatus` field exists in MongoDB
- Verify values are: 'free', 'basic', 'premium', or 'pro'
- Check for typos in field names

---

## Debugging with Console Logs

The frontend now logs detailed debugging info. Open browser console to see:

```
🔍 Searching for: "john"
📦 API Response: {...}
✅ Found 3 results

🔍 Fetching profile for user ID: 507f1f77bcf86cd799439011
📦 Profile API Response: {...}
✅ Profile loaded for: John Doe
```

If you see **❌ errors**, they'll be logged in red with full error messages.

---

## Next Steps

1. ✅ Copy the route code above
2. ✅ Add to your Express backend in the correct location
3. ✅ Register routes in server.js
4. ✅ Restart backend server
5. ✅ Test endpoints in browser console
6. ✅ Try searching in dashboard
7. ✅ Click search results to view profiles

Once endpoints are working, all search and profile viewing will work seamlessly! 🎉
