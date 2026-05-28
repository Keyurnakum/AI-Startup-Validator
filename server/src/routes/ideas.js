const express = require('express');
const IdeaValidation = require('../models/IdeaValidation');
const { ideas } = require('../storage/memoryStore');
const { isMongoConnected } = require('../config/db');
const { authenticate } = require('../middleware/auth');
const { analyzeIdea } = require('../services/analysisService');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
  if (isMongoConnected()) {
    const records = await IdeaValidation.find({ userId: req.user.id }).sort({ createdAt: -1 }).lean();
    return res.json(records);
  }

  const records = ideas
    .filter((idea) => idea.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json(records);
});

router.post('/validate', authenticate, async (req, res) => {
  const { startupName, idea, industry, targetAudience } = req.body;

  if (!startupName || !idea) {
    return res.status(400).json({ message: 'startupName and idea are required.' });
  }

  const analysis = await analyzeIdea({ startupName, idea, industry, targetAudience });

  const payload = {
    userId: req.user.id,
    startupName,
    idea,
    industry,
    targetAudience,
    analysis,
  };

  if (isMongoConnected()) {
    const created = await IdeaValidation.create(payload);
    return res.status(201).json(created);
  }

  const created = {
    ...payload,
    id: String(ideas.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  ideas.push(created);

  return res.status(201).json(created);
});

module.exports = router;
