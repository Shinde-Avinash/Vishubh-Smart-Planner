const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const moodController = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

const aiController = require('../controllers/aiController');

// Task Routes
router.post('/tasks', authMiddleware, taskController.createTask);
router.get('/tasks', authMiddleware, taskController.getTasks);
router.put('/tasks/:id', authMiddleware, taskController.updateTask);
router.delete('/tasks/:id', authMiddleware, taskController.deleteTask);

// Mood Routes
router.post('/moods', authMiddleware, moodController.logMood);
router.get('/moods', authMiddleware, moodController.getMoods);
router.put('/moods/:id', authMiddleware, moodController.updateMood);
router.delete('/moods/:id', authMiddleware, moodController.deleteMood);

// AI Routes
router.post('/ai/chat', authMiddleware, aiController.chat);
router.post('/ai/schedule', authMiddleware, aiController.generateSchedule);

// Analytics Routes
const analyticsController = require('../controllers/analyticsController');
router.get('/analytics', authMiddleware, analyticsController.getAnalytics);

// User Routes
const userController = require('../controllers/userController');
router.get('/users', authMiddleware, userController.getAllUsers);

module.exports = router;
