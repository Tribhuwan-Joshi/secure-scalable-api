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
  res.status(200).json({ todos });
});

todoRouter.post('/', async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Provide proper input values' });
  }
  const newTodo = await createTodo(title, description, req.user.id);
  return res.status(201).json({ newTodo });
});

todoRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const todo = await getTodo(id);
  if (!todo) return res.status(404).json({ message: 'todo not found' });
  if (todo.user._id != req.user.id)
    return res.status(403).json({ message: 'forbidden' });
  await deleteTodo(id);
  res.sendStatus(204);
});

todoRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Provide proper input values' });
  }
  const todo = await getTodo(id);

  if (!todo) return res.status(404).json({ message: 'todo not found' });
  console.log(todo.user._id, req.user);
  if (todo.user._id.toString() != req.user.id)
    return res.status(403).json({ message: 'forbidden' });
  const updatedTodo = await updateTodo(title, description, id);

  res.status(201).json(updatedTodo);
});
module.exports = todoRouter;
