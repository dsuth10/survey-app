const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const user = User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.displayName = user.displayName;
    req.session.classId = user.classId;

    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      res.json({
        message: 'Logged in successfully',
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          displayName: user.displayName,
          classId: user.classId
        }
      });
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully' });
  });
});

router.get('/me', (req, res) => {
  if (req.session.userId) {
    res.json({
      id: req.session.userId,
      username: req.session.username,
      role: req.session.role,
      displayName: req.session.displayName,
      classId: req.session.classId
    });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

module.exports = router;
