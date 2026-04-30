const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/stats', getTaskStats);
router.get('/', getTasks);
router.get('/:id', getTask);

router.post(
  '/',
  adminOnly,
  [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('projectId').notEmpty().withMessage('Project is required'),
  ],
  validate,
  createTask
);

router.put('/:id', updateTask);
router.delete('/:id', adminOnly, deleteTask);

module.exports = router;
