const Redis = require('ioredis');
const { RateLimiterRedis } = require('rate-limiter-flexible');

const redisClient = new Redis({
  host: 'localhost', 
  port: 6379
});

const rateLimiter = new RateLimiterRedis({
    redis: redisClient,
    points: 10,           // requests allowed
    duration: 60,          // duration
  });
  

  const rateLimiterMiddleware = async (req, res, next) => {
    try {
      await rateLimiter.consume(req.ip);  // Consume 1 point per request
      next();
    } catch (error) {
      res.status(429).json({ error: 'Too Many Requests - Rate limit exceeded' });
    }
  };
  

module.exports = rateLimiterMiddleware;
