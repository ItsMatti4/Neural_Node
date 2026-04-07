const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 }); // 15 min TTL

const cacheMiddleware = (duration = 900) => {
  return (req, res, next) => {
    const key = `__cache__${req.originalUrl}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse);
    }

    res.setHeader('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      if (res.statusCode === 200) {
        cache.set(key, body, duration);
      }
      return originalJson(body);
    };
    next();
  };
};

const clearCache = () => cache.flushAll();

module.exports = { cacheMiddleware, clearCache, cache };
