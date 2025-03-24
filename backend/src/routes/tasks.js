import express from 'express';
import { body, param } from 'express-validator';
import Task from '../models/Task.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all tasks (with filters)
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$text = { $search: search };
    }

    const tasks = await Task.find(query)
      .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('comments.user', 'name email');

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new task
router.post('/',
  auth,
  authorize(['admin', 'editor']),
  [
    body('title').trim().notEmpty(),
    body('priority').isIn(['low', 'medium', 'high']),
    body('status').isIn(['todo', 'in-progress', 'review', 'completed'])
  ],
  async (req, res) => {
    try {
      const task = new Task({
        ...req.body,
        createdBy: req.user._id
      });

      await task.save();
      
      await task.populate([
        { path: 'assignedTo', select: 'name email' },
        { path: 'createdBy', select: 'name email' }
      ]);

      // Emit socket event for real-time updates
      req.app.get('io').emit('task-created', task);

      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Update task
router.patch('/:taskId',
  auth,
  authorize(['admin', 'editor']),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      const updates = Object.keys(req.body);
      updates.forEach(update => task[update] = req.body[update]);
      
      await task.save();
      
      await task.populate([
        { path: 'assignedTo', select: 'name email' },
        { path: 'createdBy', select: 'name email' },
        { path: 'comments.user', select: 'name email' }
      ]);

      // Emit socket event for real-time updates
      req.app.get('io').emit('task-updated', task);

      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Delete task
router.delete('/:taskId',
  auth,
  authorize(['admin']),
  async (req, res) => {
    try {
      const task = await Task.findByIdAndDelete(req.params.taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Emit socket event for real-time updates
      req.app.get('io').emit('task-deleted', req.params.taskId);

      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

// Add comment to task
router.post('/:taskId/comments',
  auth,
  [
    param('taskId').isMongoId(),
    body('content').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.taskId);
      
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      task.comments.push({
        user: req.user._id,
        content: req.body.content
      });

      await task.save();
      await task.populate('comments.user', 'name email');

      // Emit socket event for real-time updates
      req.app.get('io').emit('task-comment-added', {
        taskId: task._id,
        comment: task.comments[task.comments.length - 1]
      });

      res.status(201).json(task.comments[task.comments.length - 1]);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  }
);

export default router;
