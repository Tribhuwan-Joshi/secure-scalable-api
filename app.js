const express = require('express');
const app = express();
const mongoose = require('mongoose');
const config = require('./utils/config');
const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const todoController = require('./controllers/todo');
const middlewares = require('./utils/middlewares');
const cookieParser = require('cookie-parser');
require('express-async-errors');

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', middlewares.authRateLimiter, authController);
app.use(middlewares.extractUser, middlewares.refreshAccessToken);
app.use(middlewares.crudRateLimtier);
app.use('/api/users', userController);
app.use('/api/todos', todoController);

app.use('*', middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

module.exports = app;
