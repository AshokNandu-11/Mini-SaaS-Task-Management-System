const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');

// All task routes are protected by verifyToken middleware
router.use(verifyToken);

router.post('/', createTask);       // Create task
router.get('/', getTasks);          // Get all tasks for user
router.put('/:id', updateTask);     // Toggle/update task
router.delete('/:id', deleteTask);  // Delete task

module.exports = router;
