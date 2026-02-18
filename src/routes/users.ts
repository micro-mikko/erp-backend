import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Lista alla användare i företaget
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
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// Bjud in ny användare (endast admin)
router.post('/invite', async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite users' });
    }

    const { email, name, role, password } = req.body;
    
    // Kolla om email redan finns
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
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
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error inviting user:',


cat > src/routes/users.ts << 'EOF'
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

// Lista alla användare i företaget
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
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// Bjud in ny användare (endast admin)
router.post('/invite', async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can invite users' });
    }

    const { email, name, role, password } = req.body;
    
    // Kolla om email redan finns
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
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
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error inviting user:', error);
    res.status(500).json({ error: 'Could not invite user' });
  }
});

// Uppdatera användarroll (endast admin)
router.patch('/:userId/role', async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can change roles' });
    }

    const { userId } = req.params;
    const { role } = req.body;
    
    // Kan inte ändra egen roll
    if (userId === req.user!.userId) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }
    
    const updatedUser = await prisma.user.update({
      where: { 
        id: userId,
        companyId: req.user!.companyId // Säkerställ att user tillhör företaget
      },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Could not update user role' });
  }
});

// Ta bort användare (endast admin)
router.delete('/:userId', async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete users' });
    }

    const { userId } = req.params;
    
    // Kan inte ta bort sig själv
    if (userId === req.user!.userId) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    
    await prisma.user.delete({
      where: { 
        id: userId,
        companyId: req.user!.companyId
      }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Could not delete user' });
  }
});

// Hämta företagsinfo
router.get('/company', async (req: AuthRequest, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user!.companyId },
      select: {
        id: true,
        name: true,
        businessId: true,
        address: true,
        city: true,
        postalCode: true,
        country: true,
        createdAt: true
      }
    });
    
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Could not fetch company' });
  }
});

// Uppdatera företagsinfo (endast admin)
router.patch('/company', async (req: AuthRequest, res) => {
  try {
    if (req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can update company info' });
    }

    const { name, businessId, address, city, postalCode, country } = req.body;
    
    const updatedCompany = await prisma.company.update({
      where: { id: req.user!.companyId },
      data: { name, businessId, address, city, postalCode, country }
    });
    
    res.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Could not update company' });
  }
});

export { router as usersRouter };
