const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { users } = require('../storage/memoryStore');
const { isMongoConnected } = require('../config/db');
const { authLimiter } = require('../middleware/rateLimit');

const router = express.Router();

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

router.post('/register', authLimiter, async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Name, email, and password (min 6 chars) are required.' });
  }

  const normalizedEmail = normalizeEmail(email);
  const usingMongo = isMongoConnected();

  const existingUser = usingMongo
    ? await User.findOne({ email: normalizedEmail })
    : users.find((user) => user.email === normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ message: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  let created;
  if (usingMongo) {
    created = await User.create({ name, email: normalizedEmail, passwordHash });
  } else {
    created = { id: String(users.length + 1), name, email: normalizedEmail, passwordHash };
    users.push(created);
  }

  const userId = String(created._id || created.id);
  const token = jwt.sign({ id: userId, email: normalizedEmail, name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });

  return res.status(201).json({ token, user: { id: userId, name, email: normalizedEmail } });
});

router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = normalizeEmail(email);
  const usingMongo = isMongoConnected();

  const user = usingMongo
    ? await User.findOne({ email: normalizedEmail })
    : users.find((candidate) => candidate.email === normalizedEmail);

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const passwordHash = user.passwordHash;
  const match = await bcrypt.compare(password || '', passwordHash);

  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const userId = String(user._id || user.id);
  const token = jwt.sign(
    { id: userId, email: normalizedEmail, name: user.name },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '7d' },
  );

  return res.json({ token, user: { id: userId, name: user.name, email: normalizedEmail } });
});

module.exports = router;
