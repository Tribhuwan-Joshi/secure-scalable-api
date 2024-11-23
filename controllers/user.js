const userRouter = require('express').Router();
const { getAllUsers } = require('../utils/db');
userRouter.get('/', async (req, res) => {
  const users = await getAllUsers();

  res.json({ users });
});

module.exports = userRouter;
