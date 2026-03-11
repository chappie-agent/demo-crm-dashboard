import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('crm.db');

router.get('/', (req, res) => {
  const customers = db.prepare('SELECT * FROM customers ORDER BY created_at DESC').all();
  res.json(customers);
});

router.get('/:id', (req, res) => {
  const customer = db.prepare('SELECT * FROM customers WHERE id = ?').get(req.params.id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  res.json(customer);
});

router.post('/', (req, res) => {
  const { name, email, phone, company, status } = req.body;
  const result = db.prepare('INSERT INTO customers (name, email, phone, company, status) VALUES (?, ?, ?, ?, ?)').run(name, email, phone, company, status || 'active');
  res.status(201).json({ id: result.lastInsertRowid, name, email, phone, company, status });
});

router.put('/:id', (req, res) => {
  const { name, email, phone, company, status } = req.body;
  db.prepare('UPDATE customers SET name = ?, email = ?, phone = ?, company = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, email, phone, company, status, req.params.id);
  res.json({ id: req.params.id, name, email, phone, company, status });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM customers WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
