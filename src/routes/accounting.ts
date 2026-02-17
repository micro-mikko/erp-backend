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

router.post('/transactions', async (req: AuthRequest, res) => {
  try {
    const { date, description, lines, categoryId, subcategoryId } = req.body;

    const totalDebit = lines.reduce((sum: number, l: any) => sum + (l.debit || 0), 0);
    const totalCredit = lines.reduce((sum: number, l: any) => sum + (l.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({ error: 'Debet och kredit måste vara lika' });
    }

    const transactionLines = await Promise.all(lines.map(async (line: any) => {
      const account = await prisma.account.findFirst({
        where: { accountNumber: line.accountNumber, companyId: req.user!.companyId }
      });
      if (!account) throw new Error(`Konto ${line.accountNumber} hittades inte`);
      return {
        accountId: account.id,
        debit: line.debit || 0,
        credit: line.credit || 0,
        description: line.description || description
      };
    }));

    const transaction = await prisma.transaction.create({
      data: {
        date: new Date(date),
        description,
        categoryId: categoryId || null,
        subcategoryId: subcategoryId || null,
        companyId: req.user!.companyId,
        lines: { create: transactionLines }
      },
      include: { lines: { include: { account: true } } }
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: error.message || 'Kunde inte skapa verifikat' });
  }
});

router.put('/transactions/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { date, description, lines, categoryId, subcategoryId } = req.body;

    const existing = await prisma.transaction.findFirst({
      where: { id, companyId: req.user!.companyId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Verifikat hittades inte' });
    }

    const totalDebit = lines.reduce((sum: number, l: any) => sum + (l.debit || 0), 0);
    const totalCredit = lines.reduce((sum: number, l: any) => sum + (l.credit || 0), 0);

    if (Math.abs(totalDebit - totalCredit) > 0.01) {
      return res.status(400).json({ error: 'Debet och kredit måste vara lika' });
    }

    await prisma.transactionLine.deleteMany({ where: { transactionId: id } });

    const transactionLines = await Promise.all(lines.map(async (line: any) => {
      const account = await prisma.account.findFirst({
        where: { accountNumber: line.accountNumber, companyId: req.user!.companyId }
      });
      if (!account) throw new Error(`Konto ${line.accountNumber} hittades inte`);
      return {
        accountId: account.id,
        debit: line.debit || 0,
        credit: line.credit || 0,
        description: line.description || description
      };
    }));

    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        date: new Date(date),
        description,
        categoryId: categoryId || null,
        subcategoryId: subcategoryId || null,
        lines: { create: transactionLines }
      },
      include: { lines: { include: { account: true } } }
    });

    res.json(transaction);
  } catch (error: any) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: error.message || 'Kunde inte uppdatera verifikat' });
  }
});
