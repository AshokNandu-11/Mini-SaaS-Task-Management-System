const { Task } = require('../models');

// POST /api/tasks — Create a new task
const createTask = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Task title cannot be empty.' });
    }

    const task = await Task.create({
      title: title.trim(),
      status: 'pending',
      userId: req.user.id, // from verifyToken middleware
    });

    res.status(201).json({ message: 'Task created successfully!', task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Server error. Could not create task.' });
  }
};

// GET /api/tasks — Get all tasks for the logged-in user
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Server error. Could not fetch tasks.' });
  }
};

// PUT /api/tasks/:id — Toggle task status (pending <-> completed)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    // Toggle status
    task.status = task.status === 'pending' ? 'completed' : 'pending';

    // Allow updating the title too if provided
    if (req.body.title && req.body.title.trim() !== '') {
      task.title = req.body.title.trim();
    }

    await task.save();

    res.status(200).json({ message: 'Task updated successfully!', task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Server error. Could not update task.' });
  }
};

// DELETE /api/tasks/:id — Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    await task.destroy();

    res.status(200).json({ message: 'Task deleted successfully!' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Server error. Could not delete task.' });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
