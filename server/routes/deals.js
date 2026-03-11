import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('crm.db');

router.get('/', (req, res) => {
  const deals = db.prepare(`
    SELECT deals.*, customers.name as customer_name 
    FROM deals 
    JOIN customers ON deals.customer_id = customers.id 
    ORDER BY deals.created_at DESC
  `).all();
  res.json(deals);
});

router.get('/:id', (req, res) => {
  const deal = db.prepare(`
    SELECT deals.*, customers.name as customer_name 
    FROM deals 
    JOIN customers ON deals.customer_id = customers.id 
    WHERE deals.id = ?
  `).get(req.params.id);
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  res.json(deal);
});

router.post('/', (req, res) => {
  const { customer_id, title, value, stage, probability, expected_close_date } = req.body;
  const result = db.prepare('INSERT INTO deals (customer_id, title, value, stage, probability, expected_close_date) VALUES (?, ?, ?, ?, ?, ?)').run(customer_id, title, value || 0, stage || 'lead', probability || 0, expected_close_date);
  res.status(201).json({ id: result.lastInsertRowid, customer_id, title, value, stage, probability, expected_close_date });
});

router.put('/:id', (req, res) => {
  const { customer_id, title, value, stage, probability, expected_close_date } = req.body;
  db.prepare('UPDATE deals SET customer_id = ?, title = ?, value = ?, stage = ?, probability = ?, expected_close_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(customer_id, title, value, stage, probability, expected_close_date, req.params.id);
  res.json({ id: req.params.id, customer_id, title, value, stage, probability, expected_close_date });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM deals WHERE id = ?').run(req.params.id);
  res.status(204).send();
});

export default router;
