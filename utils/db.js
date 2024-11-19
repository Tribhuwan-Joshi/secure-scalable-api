const mongoose = require('mongoose');
const Todo = require('../models/todo');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const getTodos = async (page, limit) => {};

const getTodo = async (id) => {
  const todo = await Todo.findById(id);
  return todo;
};

const createTodo = async (title, description, userId) => {
  const newTodo = await Todo.create({ title, description, user: userId });
  return newTodo;
};

const updateTodo = async (title, description, id) => {
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title, description },
    { runValidators: true, returnDocument: 'after' }
  );

  return updatedTodo;
};

const deleteTodo = async (id) => {
  await Todo.findByIdAndDelete(id);
};

// users

const createUser = async (email, username, hashedPassword) => {
  const newUser = new User({ email, hashedPassword, username });
  await newUser.save();
  const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
    expiresIn: '15m',
  });
  return token;
};

module.exports = {
  getTodo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  createUser,
};
