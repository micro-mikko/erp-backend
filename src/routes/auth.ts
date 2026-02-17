import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

router.post('/register', async (req, res) => {
  try {
    const { companyName, businessId, email, password, name } = req.body;
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    const company = await prisma.company.create({
      data: {
        name: companyName,
        businessId,
        users: {
          create: {
            email,
            passwordHash,
            name,
            role: 'admin'
          }
        }
      },
      include: { users: true }
    });
    
    const user = company.users[0];
    const token = jwt.sign(
      { userId: user.id, companyId: company.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({ token, user, company });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id, companyId: user.companyId, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user, company: user.company });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

export { router as authRouter };
