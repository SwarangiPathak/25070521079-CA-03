const router = require('express').Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', async (req, res) => {
  res.json(await Task.find({ user: req.userId }).sort({ createdAt: -1 }));
});

router.post('/', async (req, res) => {
  try {
    const { title, priority, dueDate } = req.body;
    if (!title || !title.trim()) return res.status(400).json({ message: 'Task title is required' });
    const task = await Task.create({ user: req.userId, title, priority, dueDate: dueDate || undefined });
    res.status(201).json(task);
  } catch (e) {
    res.status(400).json({ message: 'Could not add the task' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, status, priority, dueDate } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { title, status, priority, dueDate },
      { new: true, omitUndefined: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (e) {
    res.status(400).json({ message: 'Could not update the task' });
  }
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!task) return res.status(404).json({ message: 'Task not found' });
  res.json({ message: 'Task deleted' });
});

module.exports = router;
