const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(protect);

router.get('/', getProjects);
router.get('/:id', getProject);

router.post(
  '/',
  adminOnly,
  [body('name').trim().notEmpty().withMessage('Project name is required')],
  validate,
  createProject
);

router.put('/:id', adminOnly, updateProject);
router.delete('/:id', adminOnly, deleteProject);

module.exports = router;
