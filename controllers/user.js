const userRouter = require('express').Router();
const Todo = require('../models/todo');
const User = require('../models/user');

userRouter.get('/', async (req, res) => {
  const users = await getUsers();
  return users;
});

module.exports = userRouter;
