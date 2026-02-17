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

router.post('/', async (req: AuthRequest, res) => {
  try {
    const { name, businessId, email, phone, address, city, postalCode, country } = req.body;
    const customer = await prisma.customer.create({
      data: {
        name,
        businessId,
        email,
        phone,
        address,
        city,
        postalCode,
        country: country || 'FI',
        type: 'customer',
        companyId: req.user!.companyId
      }
    });
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Kunde inte skapa kund' });
  }
});

router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { name, businessId, email, phone, address, city, postalCode, country } = req.body;
    const customer = await prisma.customer.update({
      where: { id, companyId: req.user!.companyId },
      data: { name, businessId, email, phone, address, city, postalCode, country }
    });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte uppdatera kund' });
  }
});

router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id, companyId: req.user!.companyId } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort kund' });
  }
});
