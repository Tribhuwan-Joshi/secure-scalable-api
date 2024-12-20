const authRouter = require('express').Router();

const bcrypt = require('bcrypt');
const { createUser, getUser, signToken } = require('../utils/db');

authRouter.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Provide valid credentials' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const { token, refreshToken } = await createUser(
    email,
    username,
    hashedPassword
  ); // return new User with token
  res.cookie('refreshToken', refreshToken, { httpOnly: true }); // remove secure for now
  res.status(201).json({ token });
});

authRouter.post('/login', async (req, res) => {
  // get the token
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Provide valid credentials' });
  }
  const user = await getUser(email);
  if (!user) {
    return res.status(404).json({ message: "User don't exist" });
  }
  const passwordMatched = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordMatched)
    return res.status(401).json({ message: 'Invalid  password' });

  const { token, refreshToken } = signToken({ id: user._id });
  res.cookie('refreshToken', refreshToken, { httpOnly: true }); // remove secure for now
  return res.status(200).json({ token });
});

authRouter.post('/logout', middlewares.extractUser, (req, res) => {
  res.clearCookie('refreshToken');
  res.sendStatus(204);
});
module.exports = authRouter;
