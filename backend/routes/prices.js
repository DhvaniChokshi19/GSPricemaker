import express from 'express';
import mongoose from 'mongoose';
import Price from '../models/Price.js';
import { logger } from '../core/utils/logger.js';

const router = express.Router();
let memoryFallbackStore = [];

// GET /api/prices/latest - fetch most recent price
router.get('/latest', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const latest = await Price.findOne().sort({ createdAt: -1 });
      return res.json({ success: true, data: latest });
    } else {
      const latest = memoryFallbackStore[memoryFallbackStore.length - 1] || null;
      return res.json({ success: true, data: latest, isFallback: true });
    }
  } catch (err) {
    logger.error('Error fetching latest price:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/prices - fetch all prices (history & CSV export)
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const prices = await Price.find().sort({ createdAt: -1 });
      return res.json({ success: true, count: prices.length, data: prices });
    } else {
      return res.json({ success: true, count: memoryFallbackStore.length, data: [...memoryFallbackStore].reverse(), isFallback: true });
    }
  } catch (err) {
    logger.error('Error fetching prices list:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/prices - save new price entry (creates new record every time)
router.post('/', async (req, res) => {
  try {
    const { date, time, gold24k, gold22k, gold20k, silver, note } = req.body;

    if (!gold24k || !gold22k || !gold20k || !silver) {
      return res.status(400).json({ success: false, error: 'All rate fields are required.' });
    }

    const priceEntry = {
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
      gold24k: Number(gold24k),
      gold22k: Number(gold22k),
      gold20k: Number(gold20k),
      silver: Number(silver),
      note: note || '',
      createdAt: new Date(),
    };

    if (mongoose.connection.readyState === 1) {
      const newPrice = new Price(priceEntry);
      await newPrice.save();
      logger.info(`Saved new price entry to MongoDB for date: ${priceEntry.date}`);
      return res.status(201).json({ success: true, message: 'Price entry saved successfully', data: newPrice });
    } else {
      priceEntry._id = 'mem_' + Date.now();
      memoryFallbackStore.push(priceEntry);
      logger.info(`Saved new price entry to local memory for date: ${priceEntry.date}`);
      return res.status(201).json({ success: true, message: 'Price entry saved (local memory)', data: priceEntry, isFallback: true });
    }
  } catch (err) {
    logger.error('Error saving price:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/prices/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Price.findByIdAndDelete(id);
    } else {
      memoryFallbackStore = memoryFallbackStore.filter(item => item._id !== id);
    }
    logger.info(`Deleted price entry: ${id}`);
    res.json({ success: true, message: 'Record deleted' });
  } catch (err) {
    logger.error('Error deleting price:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;

