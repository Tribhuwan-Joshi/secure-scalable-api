const jwt = require('jsonwebtoken');
const config = require('./config');
const redis = require('./redisClient');

const extractUser = async (req, res, next) => {
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

const rateLimtier = async (req, res, next) => {
  const timeWindow = config.timeWindow || 60000;
  const reqLimit = config.reqLimit || 10;
  const key = req.url + req.ip;
  const reqRange = Date.now() - timeWindow;

  try {
    const timestamps = await redis.lrange(key, 0, -1);
    const currentTime = Date.now();

    const recentRequests = timestamps.filter((timestamp) => {
      return parseInt(timestamp) >= reqRange;
    });

    if (recentRequests.length >= reqLimit) {
      const waitTime = Math.ceil(
        timeWindow - (currentTime - parseInt(recentRequests[0]))
      );
      console.log(
        currentTime,
        recentRequests[0],
        waitTime,
        timeWindow - (currentTime - recentRequests[0])
      );
      return res.status(429).json({
        message: 'Too many requests',
        waitTime: Math.ceil(waitTime / 1000), // Convert to seconds
      });
    }

    await redis.rpush(key, currentTime);
    await redis.expire(key, Math.ceil(timeWindow / 1000));
  } catch (error) {
    console.error('Rate limiting error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  // get all the req from that key filter by time greater than or equal to reqRange

  // if reqRange count is greater than reqLimit -> send 429 in res.json()-> too many request
  // least amount of time to wait before eligible for request -> greatest time(after fliter) - reqRange

  // if reqRange is less -> add current time -> Date.now() to list of the key and proceed

  next();
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  extractUser,
  refreshAccessToken,
  rateLimtier,
};
