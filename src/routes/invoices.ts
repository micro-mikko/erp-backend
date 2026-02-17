import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { companyId: req.user!.companyId },
      include: {
        customer: true,
        lines: true
      },
      orderBy: { issueDate: 'desc' }
    });
    
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Could not fetch invoices' });
  }
});

export { router as invoiceRouter };
