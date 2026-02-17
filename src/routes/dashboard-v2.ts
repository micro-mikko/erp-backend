import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
router.use(authenticate);

router.get('/summary', async (req: AuthRequest, res) => {
  try {
    const companyId = req.user!.companyId;
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const transactions = await prisma.transaction.findMany({
      where: { companyId, date: { gte: startOfYear } },
      include: { lines: { include: { account: true } } }
    });

    // Intäkter = konton som börjar på 3
    const revenueYTD = transactions
      .flatMap(t => t.lines)
      .filter(l => l.account.accountNumber.startsWith('3'))
      .reduce((sum, l) => sum + l.credit, 0);

    // Kostnader = konton som börjar på 4,5,6,7
    const expensesYTD = transactions
      .flatMap(t => t.lines)
      .filter(l => ['4','5','6','7'].includes(l.account.accountNumber[0]))
      .reduce((sum, l) => sum + l.debit, 0);

    // Per kategori
    const byCategory: Record<string, number> = {};
    for (const t of transactions) {
      if (!t.categoryId) continue;
      const amount = t.lines.reduce((sum, l) => sum + l.debit, 0);
      byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + amount;
    }

    // Månad för månad senaste 6 månader
    const monthly = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthTx = transactions.filter(t => t.date >= monthStart && t.date <= monthEnd);
      
      const revenue = monthTx.flatMap(t => t.lines)
        .filter(l => l.account.accountNumber.startsWith('3'))
        .reduce((sum, l) => sum + l.credit, 0);
      
      const expenses = monthTx.flatMap(t => t.lines)
        .filter(l => ['4','5','6','7'].includes(l.account.accountNumber[0]))
        .reduce((sum, l) => sum + l.debit, 0);

      monthly.push({
        month: monthStart.toLocaleString('sv-SE', { month: 'short', year: 'numeric' }),
        revenue,
        expenses,
        profit: revenue - expenses
      });
    }

    res.json({
      revenueYTD,
      expensesYTD,
      profitYTD: revenueYTD - expensesYTD,
      byCategory,
      monthly
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Kunde inte hämta dashboard-data' });
  }
});

export { router as dashboardV2Router };
