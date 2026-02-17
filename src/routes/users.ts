import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Hämta alla användare för företaget
router.get('/', async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { companyId: req.user!.companyId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte hämta användare' });
  }
});

// Bjud in / skapa ny användare till samma företag
router.post('/invite', async (req: AuthRequest, res) => {
  try {
    const { email, name, role, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'E-postadressen används redan' });
    }

    const passwordHash = await bcrypt.hash(password || 'Byt2024!', 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: role || 'user',
        passwordHash,
        companyId: req.user!.companyId
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Kunde inte skapa användare' });
  }
});

// Ta bort användare
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({
      where: { id, companyId: req.user!.companyId }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Kunde inte ta bort användare' });
  }
});

export { router as usersRouter };
