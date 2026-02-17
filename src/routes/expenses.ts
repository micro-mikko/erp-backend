import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const expenses = await prisma.expense.findMany({
      where: { companyId: req.user!.companyId },
      orderBy: { date: 'desc' }
    });
    
    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Could not fetch expenses' });
  }
});

export { router as expenseRouter };
