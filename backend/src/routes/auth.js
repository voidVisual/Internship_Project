import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const user = new User({
        email,
        password,
        name,
        role: 'viewer' // Default role
      });

      await user.save();

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Login user
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          preferences: user.preferences
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        preferences: req.user.preferences
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user preferences
router.patch('/preferences', auth, async (req, res) => {
  try {
    const { darkMode, emailNotifications } = req.body;
    
    req.user.preferences = {
      ...req.user.preferences,
      ...(darkMode !== undefined && { darkMode }),
      ...(emailNotifications !== undefined && { emailNotifications })
    };

    await req.user.save();
    
    res.json({ preferences: req.user.preferences });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
