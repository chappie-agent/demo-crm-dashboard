import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import dealRoutes from './routes/deals.js';
import dashboardRoutes from './routes/dashboard.js';
import { authenticateToken } from './middleware/auth.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/customers', authenticateToken, customerRoutes);
app.use('/api/deals', authenticateToken, dealRoutes);
app.use('/api/dashboard', authenticateToken, dashboardRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
