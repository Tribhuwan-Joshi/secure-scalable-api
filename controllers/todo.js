const {
  createTodo,
  getTodo,
  getTodos,
  updateTodo,
  deleteTodo,
} = require('../utils/db');

const todoRouter = require('express').Router();

todoRouter.get('/', async (req, res) => {
  const todos = await getTodos();
  return todos;
});

todoRouter.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Provide proper input values' });
  }
  const newTodo = await createTodo(title, description);
  return res.status(201).json(newTodo);
});

todoRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await getTodo(id);
  if (!todo) return res.status(404).json({ message: 'todo not found' });
  if (todo._id != req.user._id)
    return res.status(403).json({ message: 'forbidden' });
  await deleteTodo(id);
  res.status(204);
});

todoRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Provide proper input values' });
  }
  const todo = await getTodo(id);
  if (!todo) return res.status(404).json({ message: 'todo not found' });
  if (todo._id != req.user._id)
    return res.status(403).json({ message: 'forbidden' });
  const updatedTodo = await updateTodo(id);
  res.status(204).json(updatedTodo);
});
module.exports = todoRouter;
