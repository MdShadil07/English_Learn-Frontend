# Quick Copy-Paste: Backend Routes for MongoDB

## ⚡ FASTEST WAY TO GET SEARCH WORKING

Just copy & paste these two route handlers into your Express backend. No configuration needed!

---

## 📋 Route Code (Copy This Entire Block)

```javascript
// ========================================
// USER SEARCH & PROFILE ROUTES
// ========================================

import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// ✅ ROUTE 1: Search Users
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q?.trim()) {
      return res.json({ success: false, message: 'Query required', data: [] });
    }

    const users = await db.collection('users').find({
      $or: [
        { fullName: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ],
    })
    .limit(10)
    .toArray();

    const data = users.map(u => ({
      id: u._id.toString(),
      fullName: u.fullName || '',
      email: u.email || '',
      avatar: u.avatarUrl || null,
      level: u.level || 0,
      role: u.role || 'student',
      subscriptionStatus: u.subscriptionStatus || 'free',
      bio: u.bio || '',
      location: u.location || '',
      skills: u.skills || [],
      currentStreak: u.currentStreak || 0,
      totalXP: u.xpTotal || 0,
      totalSessions: u.sessions || 0,
      joinedDate: u.joinedDate || u.createdAt,
    }));

    res.json({ success: true, message: 'Found', data });
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ success: false, message: 'Search failed', data: [] });
  }
});

// ✅ ROUTE 2: Get User Profile
router.get('/:userId/public-profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid ID', data: null });
    }

    const user = await db.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'Not found', data: null });
    }

    const data = {
      id: user._id.toString(),
      fullName: user.fullName || 'Unknown',
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

    res.json({ success: true, message: 'Profile loaded', data });
  } catch (err) {
    console.error('❌ Profile error:', err);
    res.status(500).json({ success: false, message: 'Failed to load profile', data: null });
  }
});

export default router;
```

---

## 📝 THREE THINGS TO DO

### 1️⃣ Save the code above to: `routes/user.js` (or add to existing routes)

### 2️⃣ Register in your `server.js`:
```javascript
import userRoutes from './routes/user.js';

// Add this BEFORE app.listen()
app.use('/api/user', userRoutes);
```

### 3️⃣ Restart your backend server
```bash
npm start
# OR
node server.js
```

---

## 🧪 TEST IT IMMEDIATELY

Open browser console (F12) paste this:

```javascript
// Test Search
fetch('http://localhost:5000/api/user/search?q=john', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
})
.then(r => r.json())
.then(d => console.log('Search results:', d))

// Test Profile (replace ID with real user)
fetch('http://localhost:5000/api/user/507f1f77bcf86cd799439011/public-profile', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
})
.then(r => r.json())
.then(d => console.log('Profile:', d))
```

---

## ❓ COMMON FIXES

### Getting 404?
- Check file saved as `routes/user.js`
- Check `app.use('/api/user', userRoutes);` is in server.js
- Check it's BEFORE `app.listen()`
- Restart server

### Getting empty results?
- Make sure you have users in MongoDB
- Check field names: `fullName`, `email`, `username`
- Try searching by email first

### Getting 401?
- Make sure `authenticateToken` middleware exists
- Check token in localStorage (open DevTools → Application → Local Storage)
- Verify token is valid

### Avatar not showing?
- Check `avatarUrl` field in MongoDB has values
- Backend converts it to `avatar` for frontend automatically

---

## 🎯 THAT'S IT!

Once both routes return data successfully, your frontend will automatically work. No other changes needed! ✨

The search component will:
- ✅ Search by name, email, username
- ✅ Show avatars and user info
- ✅ Cache results (fast!)
- ✅ Navigate to profile on click
