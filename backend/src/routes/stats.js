/*
  CHANGES MADE:
  - Implemented in-memory caching for the /api/stats endpoint to avoid recalculating stats on every request.
  - The cache is automatically invalidated if the items.json file changes (using fs.watch).
  - This greatly improves performance for repeated stats requests while ensuring data stays up-to-date.
*/
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

// Memory cache
let statsCache = null;
let lastCacheTime = 0;

// Watch to invalidate cache if the file changes
fs.watch(DATA_PATH, () => {
  statsCache = null;
});

// GET /api/stats
router.get('/', (req, res, next) => {
  if (statsCache) {
    return res.json(statsCache);
  }
  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    const items = JSON.parse(raw);
    // Intentional heavy CPU calculation
    const stats = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length
    };
    statsCache = stats;
    lastCacheTime = Date.now();
    res.json(stats);
  });
});

module.exports = router;