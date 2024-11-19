const authRouter = require('express').Router();
const bcrypt = require('bcrypt');
const { createUser } = require('../utils/db');

authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Provide valid credentials' });
  }

  const hashedPassword = bcrypt.hash(password, 10);
  const token = await createUser(email, username, hashedPassword); // return new User with token
  res.status(201).json(token);
});

authRouter.post('/login', async (req, res) => {
  // get the token
  const { email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Provide valid credentials' });
  }
});

module.exports = authRouter;
