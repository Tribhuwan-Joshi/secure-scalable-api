const mongoose = require('mongoose');
const Todo = require('../models/todo');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const getTodos = async (page, limit) => {
  const todos = await Todo.find();
  return todos;
};

const getTodo = async (id) => {
  const todo = await Todo.findById(id).populate('user');
  return todo;
};

const createTodo = async (title, description, userId) => {
  const newTodo = await Todo.create({ title, description, user: userId });
  return newTodo;
};

const updateTodo = async (title, description, id) => {
  console.log(id);
  const updatedTodo = await Todo.findByIdAndUpdate(
    id,
    { title, description },
    { runValidators: true, returnDocument: 'after' }
  );
  console.log(updatedTodo);
  return updatedTodo;
};

const deleteTodo = async (id) => {
  await Todo.findByIdAndDelete(id);
};

// users

const createUser = async (email, username, hashedPassword) => {
  const newUser = new User({ email, hashedPassword, username });
  await newUser.save();
  const token = signToken({ id: newUser._id });
  return token;
};

const getUser = async (email) => {
  const user = await User.findOne({ email });

  return user;
};

const signToken = (payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
  return token;
};

module.exports = {
  getTodo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  createUser,
  getUser,
  signToken,
};
