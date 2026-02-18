import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/metrics', async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    
    // Hämta alla transaktionsrader för företaget
    const transactionLines = await prisma.transactionLine.findMany({
      where: {
        transaction: {
          companyId: req.user!.companyId,
          date: {
            gte: startOfYear
          }
        }
      },
      include: {
        account: true,
        transaction: true
      }
    });
    
    let cashBalance = 0;
    let revenueYTD = 0;
    let expensesYTD = 0;
    
    transactionLines.forEach(line => {
      const accountNumber = line.account.accountNumber;
      
      // Kassa (1900)
      if (accountNumber === '1900') {
        cashBalance += line.debit - line.credit;
      }
      
      // Intäkter (3xxx)
      if (accountNumber.startsWith('3')) {
        revenueYTD += line.credit;
      }
      
      // Kostnader (4xxx-7xxx)
      if (['4', '5', '6', '7'].includes(accountNumber[0])) {
        expensesYTD += line.debit;
      }
    });
    
    const profitYTD = revenueYTD - expensesYTD;
    
    res.json({
      liquidity: {
        label_sv: 'Likviditet',
        label_fi: 'Maksuvalmius',
        amount: cashBalance,
        currency: 'EUR'
      },
      revenue: {
        label_sv: 'Omsättning',
        label_fi: 'Liikevaihto',
        ytd: revenueYTD,
        last12Months: revenueYTD,
        currency: 'EUR'
      },
      profit: {
        label_sv: 'Resultat',
        label_fi: 'Tulos',
        ytd: profitYTD,
        last12Months: profitYTD,
        marginPercent: revenueYTD > 0 ? (profitYTD / revenueYTD) * 100 : 0,
        currency: 'EUR'
      }
    });
    
  } catch (error) {
    console.error('Error fetching metrics:', error);
    res.status(500).json({ error: 'Could not fetch metrics' });
  }
});

export { router as dashboardRouter };
