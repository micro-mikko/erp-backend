import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// Hårdkodade kategorier (kan senare flyttas till databas)
const CATEGORIES = [
  {
    id: 'income',
    name: 'Intäkter',
    subcategories: [
      { id: 'sales-25', name: 'Försäljning 25,5% moms', accounts: { debit: '1900', credit: '3010' } },
      { id: 'sales-14', name: 'Försäljning 14% moms', accounts: { debit: '1900', credit: '3020' } },
      { id: 'sales-10', name: 'Försäljning 10% moms', accounts: { debit: '1900', credit: '3030' } },
      { id: 'sales-0', name: 'Momsfri försäljning', accounts: { debit: '1900', credit: '3040' } }
    ]
  },
  {
    id: 'personnel',
    name: 'Personalkostnader',
    subcategories: [
      { id: 'salary', name: 'Lön', accounts: { debit: '5000', credit: '1900' } },
      { id: 'social', name: 'Sociala avgifter', accounts: { debit: '5000', credit: '1900' } }
    ]
  },
  {
    id: 'it',
    name: 'IT & Kommunikation',
    subcategories: [
      { id: 'software', name: 'Programvara', accounts: { debit: '7600', credit: '1900' } },
      { id: 'telecom', name: 'Telefoni', accounts: { debit: '7600', credit: '1900' } },
      { id: 'hosting', name: 'Hosting', accounts: { debit: '7600', credit: '1900' } }
    ]
  },
  {
    id: 'office',
    name: 'Lokalkostnader',
    subcategories: [
      { id: 'rent', name: 'Hyra', accounts: { debit: '7200', credit: '1900' } },
      { id: 'utilities', name: 'El & Uppvärmning', accounts: { debit: '7200', credit: '1900' } }
    ]
  },
  {
    id: 'purchases',
    name: 'Inköp material',
    subcategories: [
      { id: 'materials', name: 'Material & Varor', accounts: { debit: '4000', credit: '1900' } },
      { id: 'services', name: 'Tjänster', accounts: { debit: '4000', credit: '1900' } }
    ]
  },
  {
    id: 'other',
    name: 'Övriga kostnader',
    subcategories: [
      { id: 'other-expense', name: 'Övrig kostnad', accounts: { debit: '7000', credit: '1900' } }
    ]
  }
];

router.get('/', async (req: AuthRequest, res) => {
  res.json(CATEGORIES);
});

export { router as categoriesRouter };
