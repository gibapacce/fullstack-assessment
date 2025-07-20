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

/*
  CHANGE: Robust fs.watch usage (directory)
  - Now checks if the directory exists before trying to watch it. If neither the file nor the directory exists, logs a warning and does not watch.
  - The old code is kept below, commented out, for reference.
*/
const dir = path.dirname(DATA_PATH);

if (fs.existsSync(DATA_PATH)) {
  fs.watch(DATA_PATH, () => {
    statsCache = null;
  });
} else if (fs.existsSync(dir)) {
  // Watch the directory and re-setup the file watcher if the file is created
  fs.watch(dir, (eventType, filename) => {
    if (filename === 'items.json' && fs.existsSync(DATA_PATH)) {
      fs.watch(DATA_PATH, () => {
        statsCache = null;
      });
    }
  });
} else {
  // Directory does not exist, so do not watch. Log a warning.
  console.warn(`Directory ${dir} does not exist. Cache auto-invalidation is disabled until the directory is created.`);
}

/*
// Old code (would throw if file or directory does not exist):
fs.watch(DATA_PATH, () => {
  statsCache = null;
});
*/

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