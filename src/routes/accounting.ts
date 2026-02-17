import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/accounts', async (req: AuthRequest, res) => {
  try {
    const accounts = await prisma.account.findMany({
      where: { 
        companyId: req.user!.companyId,
        isActive: true 
      },
      orderBy: { accountNumber: 'asc' }
    });
    
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Could not fetch accounts' });
  }
});

router.get('/transactions', async (req: AuthRequest, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { companyId: req.user!.companyId },
      include: {
        lines: {
          include: {
            account: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 100
    });
    
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Could not fetch transactions' });
  }
});

export { router as accountingRouter };
