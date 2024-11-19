const jwt = require('jsonwebtoken');
const config = require('./config');
const extractUser = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'unauthorized' });
  const user = jwt.verify(token, config.JWT_SECRET);
  req.user = user;
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  next();
};

module.exports = { unknownEndpoint, errorHandler, extractUser };
