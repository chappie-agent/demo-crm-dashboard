import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Database from 'better-sqlite3';
import { generateToken, JWT_SECRET } from '../middleware/auth.js';

const router = express.Router();
const db = new Database('crm.db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

router.post('/register', (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields required' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare('INSERT INTO users (username, password, email) VALUES (?, ?, ?)').run(username, hashedPassword, email);
    const token = generateToken({ id: result.lastInsertRowid, username });
    res.status(201).json({ token, user: { id: result.lastInsertRowid, username, email } });
  } catch (err) {
    res.status(400).json({ error: 'Username already exists' });
  }
});

router.get('/me', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.prepare('SELECT id, username, email FROM users WHERE id = ?').get(decoded.id);
    res.json(user);
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
});

export default router;
