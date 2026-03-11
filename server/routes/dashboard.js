import express from 'express';
import Database from 'better-sqlite3';

const router = express.Router();
const db = new Database('crm.db');

router.get('/stats', (req, res) => {
  const totalCustomers = db.prepare('SELECT COUNT(*) as count FROM customers').get().count;
  const activeCustomers = db.prepare("SELECT COUNT(*) as count FROM customers WHERE status = 'active'").get().count;
  const totalDeals = db.prepare('SELECT COUNT(*) as count FROM deals').get().count;
  const totalRevenue = db.prepare("SELECT COALESCE(SUM(value), 0) as total FROM deals WHERE stage = 'closed_won'").get().total;
  const pipelineValue = db.prepare("SELECT COALESCE(SUM(value), 0) as total FROM deals WHERE stage NOT IN ('closed_won', 'lost')").get().total;
  const wonDeals = db.prepare("SELECT COUNT(*) as count FROM deals WHERE stage = 'closed_won'").get().count;
  const leadCount = db.prepare("SELECT COUNT(*) as count FROM deals WHERE stage = 'lead'").get().count;
  const negotiationCount = db.prepare("SELECT COUNT(*) as count FROM deals WHERE stage = 'negotiation'").get().count;

  res.json({
    totalCustomers,
    activeCustomers,
    totalDeals,
    totalRevenue,
    pipelineValue,
    wonDeals,
    leadCount,
    negotiationCount
  });
});

export default router;
