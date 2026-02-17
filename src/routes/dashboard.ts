import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/metrics', async (req: AuthRequest, res) => {
  try {
    res.json({
      liquidity: { amount: 0, currency: 'EUR' },
      revenue: { ytd: 0, currency: 'EUR' },
      profit: { ytd: 0, currency: 'EUR' }
    });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Could not fetch metrics' });
  }
});

export { router as dashboardRouter };
