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
            account: {
              select: {
                id: true,
                accountNumber: true,
                nameSv: true,
                type: true
              }
            }
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

router.post('/transactions', async (req: AuthRequest, res) => {
  try {
    const { date, description, lines } = req.body;
    
    const lastTransaction = await prisma.transaction.findFirst({
      where: { companyId: req.user!.companyId },
      orderBy: { voucherNumber: 'desc' }
    });
    
    const lastNumber = lastTransaction ? parseInt(lastTransaction.voucherNumber.replace(/\D/g, '')) : 0;
    const voucherNumber = `V${String(lastNumber + 1).padStart(4, '0')}`;
    
    const transaction = await prisma.transaction.create({
      data: {
        companyId: req.user!.companyId,
        date: new Date(date),
        description,
        voucherNumber,
        lines: {
          create: lines.map((line: any) => ({
            accountId: line.accountId,
            debit: line.debit || 0,
            credit: line.credit || 0,
            description: line.description
          }))
        }
      },
      include: {
        lines: {
          include: {
            account: true
          }
        }
      }
    });
    
    res.status(201).json(transaction);
    
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Could not create transaction' });
  }
});

router.put('/transactions/:id', async (req: AuthRequest, res) => {
  try {
    const { date, description, lines } = req.body;
    
    // Ta bort gamla rader
    await prisma.transactionLine.deleteMany({
      where: { transactionId: req.params.id }
    });
    
    // Uppdatera transaction med nya rader
    const transaction = await prisma.transaction.update({
      where: { id: req.params.id },
      data: {
        date: new Date(date),
        description,
        lines: {
          create: lines.map((line: any) => ({
            accountId: line.accountId,
            debit: line.debit || 0,
            credit: line.credit || 0,
            description: line.description
          }))
        }
      },
      include: {
        lines: {
          include: {
            account: true
          }
        }
      }
    });
    
    res.json(transaction);
    
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Could not update transaction' });
  }
});

router.delete('/transactions/:id', async (req: AuthRequest, res) => {
  try {
    await prisma.transaction.delete({
      where: { id: req.params.id }
    });
    
    res.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Could not delete transaction' });
  }
});

export { router as accountingRouter };
