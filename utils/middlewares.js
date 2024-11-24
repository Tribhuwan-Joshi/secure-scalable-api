const jwt = require('jsonwebtoken');
const config = require('./config');
const redis = require('./redisClient');

const extractUser = async (req, res, next) => {
  console.log(req.url);
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'unauthorized' });
  req.tokenExpired = false;
  jwt.verify(token, config.JWT_SECRET, (err, decode) => {
    if (err && err.name == 'TokenExpiredError') {
      req.tokenExpired = true;
      return;
    }
    if (err) throw err;
    req.user = decode;
  });
  // console.log('user extracted ', user);

  next();
};

const refreshAccessToken = async (req, res, next) => {
  if (req.tokenExpired) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return res.status(401).json({ message: 'Refresh token required' });

    jwt.verify(refreshToken, config.REFRESH_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ message: 'Invalid refresh token' });

      const newAccessToken = jwt.sign({ id: user.id }, config.JWT_SECRET, {
        expiresIn: '15m',
      });

      res.json({ token: newAccessToken });
    });
    // create new access token and refresh token and send it in json
  } else return next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};
const errorHandler = (error, request, response, next) => {
  console.log('error message hai ', error.message, ' END ');
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `email` to be unique' });
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }

  next(error);
};

const authRateLimiter = async (req, res, next) => {};

const crudRateLimtier = async (req, res, next) => {};

module.exports = {
  unknownEndpoint,
  errorHandler,
  extractUser,
  refreshAccessToken,
  authRateLimiter,
  crudRateLimtier,
};
