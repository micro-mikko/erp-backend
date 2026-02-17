import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const customers = await prisma.customer.findMany({
      where: { companyId: req.user!.companyId },
      orderBy: { name: 'asc' }
    });
    
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Could not fetch customers' });
  }
});

export { router as customerRouter };
