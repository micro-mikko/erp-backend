import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { accountingRouter } from './routes/accounting';
import { invoiceRouter } from './routes/invoices';
import { customerRouter } from './routes/customers';
import { expenseRouter } from './routes/expenses';
import { vatRouter } from './routes/vat';
import { dashboardRouter } from './routes/dashboard';
import { usersRouter } from './routes/users';
import { categoriesRouter } from './routes/categories';
import { suppliersRouter } from './routes/suppliers';
import { dashboardV2Router } from './routes/dashboard-v2';

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/accounting', accountingRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/customers', customerRouter);
app.use('/api/expenses', expenseRouter);
app.use('/api/vat', vatRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/users', usersRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/suppliers', suppliersRouter);
app.use('/api/dashboard-v2', dashboardV2Router);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok',
    message: 'ERP Backend fungerar! 🚀',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend körs på http://localhost:${PORT}`);
});
