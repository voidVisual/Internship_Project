import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/',
  auth,
  authorize(['admin']),
  async (req, res) => {
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update user role (admin only)
router.patch('/:userId/role',
  auth,
  authorize(['admin']),
  [
    body('role').isIn(['admin', 'editor', 'viewer'])
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.role = req.body.role;
      await user.save();

      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update user profile
router.patch('/profile',
  auth,
  [
    body('name').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail()
  ],
  async (req, res) => {
    try {
      const updates = Object.keys(req.body);
      const allowedUpdates = ['name', 'email', 'avatar'];
      const isValidOperation = updates.every(update => allowedUpdates.includes(update));

      if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
      }

      updates.forEach(update => req.user[update] = req.body[update]);
      await req.user.save();

      res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        avatar: req.user.avatar,
        preferences: req.user.preferences
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Change password
router.patch('/password',
  auth,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      const isMatch = await req.user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      req.user.password = newPassword;
      await req.user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
