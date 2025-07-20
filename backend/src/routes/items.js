/*
  CHANGES MADE:
  - Replaced blocking fs.readFileSync/fs.writeFileSync with async fs.promises methods for non-blocking I/O.
  - Added support for 'offset' query parameter to enable pagination (together with 'limit').
  - The 'q' parameter allows server-side search by item name.
  - The GET /api/items route now supports efficient, paginated, and filtered data retrieval for the frontend.
*/
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

// Disable cache for all API routes
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  res.status(200); // Force status 200 for all API responses
  next();
});

// Utility to read data (async)
async function readData() {
  const raw = await fs.readFile(DATA_PATH);
  return JSON.parse(raw);
}

// GET /api/items
router.get('/', async (req, res, next) => {
  try {
    const data = await readData();
    const { limit, q, offset } = req.query;
    let results = data;

    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter(item => item.name.toLowerCase().includes(q.toLowerCase()));
    }

    // Apply offset before limit
    let start = 0;
    if (offset) {
      start = parseInt(offset) || 0;
      results = results.slice(start);
    }

    if (limit) {
      results = results.slice(0, parseInt(limit));
    }

    res.json(results);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get('/:id', async (req, res, next) => {
  try {
    // Remove conditional headers to force fresh response
    delete req.headers['if-none-match'];
    delete req.headers['if-modified-since'];
    const data = await readData();
    const paramId = req.params.id;
    const item = data.find(i => String(i.id) === String(paramId));
    if (!item) {
      const err = new Error('Item not found');
      err.status = 404;
      throw err;
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post('/', async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const item = req.body;
    const data = await readData();
    item.id = Date.now();
    data.push(item);
    await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;