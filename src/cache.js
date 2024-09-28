const Redis = require('ioredis');

const redisClient = new Redis({
  host: 'localhost',
  port: 6379
});

// Cache middleware
const cache = async (req, res, next) => {
  const cacheKey = req.originalUrl;

  try {
    const cachedResponse = await redisClient.get(cacheKey);
    if (cachedResponse) {
      return res.status(200).json(JSON.parse(cachedResponse));
    }
    res.sendResponse = res.json;
    res.json = (body) => {
      redisClient.set(cacheKey, JSON.stringify(body), 'EX', 60); // Cache for 60 seconds
      res.sendResponse(body);
    };
    next();
  } catch (error) {
    console.error('Cache error:', error);
    next();  // Proceed even if caching fails
  }
};

module.exports = cache;
