const express = require('express');
const IdeaValidation = require('../models/IdeaValidation');
const { ideas } = require('../storage/memoryStore');
const { isMongoConnected } = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  const records = isMongoConnected()
    ? await IdeaValidation.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10).lean()
    : ideas
      .filter((idea) => idea.userId === req.user.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);

  const averageScore = records.length
    ? Math.round(records.reduce((total, item) => total + (item.analysis?.startupScore || 0), 0) / records.length)
    : 0;

  return res.json({
    totalIdeas: records.length,
    averageScore,
    recentIdeas: records,
  });
});

module.exports = router;
