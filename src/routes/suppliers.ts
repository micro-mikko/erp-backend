import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
router.use(authenticate);

router.get('/', async (req: AuthRequest, res) => {
  try {
    const suppliers = await prisma.customer.findMany({
      where: { companyId: req.user!.companyId, type: 'supplier' }
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta leverantörer' });
  }
});

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, businessId, email, phone, address, city } = req.body;
    const supplier = await prisma.customer.create({
      data: { name, businessId, email, phone, address, city, type: 'supplier', companyId: req.user!.companyId }
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte skapa leverantör' });
  }
});

export { router as suppliersRouter };
