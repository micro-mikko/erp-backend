import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const CATEGORIES = [
  {
    id: 'income',
    name: 'Intäkter',
    subcategories: [
      { id: 'consulting', name: 'Consulting', accounts: { debit: '1900', credit: '3010' } },
      { id: 'recurring', name: 'Recurring Revenue', accounts: { debit: '1900', credit: '3010' } },
      { id: 'one-time', name: 'One-time Sales', accounts: { debit: '1900', credit: '3010' } },
      { id: 'products', name: 'Products', accounts: { debit: '1900', credit: '3020' } }
    ]
  },
  {
    id: 'cogs',
    name: 'COGS (Cost of Goods Sold)',
    subcategories: [
      { id: 'hosting', name: 'Hosting & Infrastructure', accounts: { debit: '4000', credit: '1900' } },
      { id: 'ai-tools', name: 'AI Software & APIs', accounts: { debit: '4000', credit: '1900' } },
      { id: 'production-services', name: 'Production Services', accounts: { debit: '4000', credit: '1900' } }
    ]
  },
  {
    id: 'software',
    name: 'Programvarulicenser',
    subcategories: [
      { id: 'saas', name: 'SaaS Subscriptions', accounts: { debit: '7600', credit: '1900' } },
      { id: 'licenses', name: 'Software Licenses', accounts: { debit: '7600', credit: '1900' } },
      { id: 'tools', name: 'Development Tools', accounts: { debit: '7600', credit: '1900' } }
    ]
  },
  {
    id: 'hardware',
    name: 'Hårdvara',
    subcategories: [
      { id: 'computers', name: 'Datorer & Servrar', accounts: { debit: '1200', credit: '1900' } },
      { id: 'peripherals', name: 'Kringutrustning', accounts: { debit: '7600', credit: '1900' } },
      { id: 'network', name: 'Nätverksutrustning', accounts: { debit: '1200', credit: '1900' } }
    ]
  },
  {
    id: 'personnel',
    name: 'Personalkostnader',
    subcategories: [
      { id: 'salary', name: 'Lön', accounts: { debit: '5000', credit: '1900' } },
      { id: 'social', name: 'Sociala avgifter', accounts: { debit: '5000', credit: '1900' } },
      { id: 'consultants', name: 'Konsulter', accounts: { debit: '5000', credit: '1900' } }
    ]
  },
  {
    id: 'marketing',
    name: 'Marknadsföring',
    subcategories: [
      { id: 'ads', name: 'Annonsering', accounts: { debit: '7000', credit: '1900' } },
      { id: 'content', name: 'Content Production', accounts: { debit: '7000', credit: '1900' } },
      { id: 'events', name: 'Events & Sponsring', accounts: { debit: '7000', credit: '1900' } }
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
    id: 'other',
    name: 'Övriga kostnader',
    subcategories: [
      { id: 'admin', name: 'Administration', accounts: { debit: '7000', credit: '1900' } },
      { id: 'professional', name: 'Professionella tjänster', accounts: { debit: '7000', credit: '1900' } },
      { id: 'other', name: 'Övrigt', accounts: { debit: '7000', credit: '1900' } }
    ]
  }
];

router.get('/', async (req: AuthRequest, res) => {
  res.json(CATEGORIES);
});

export { router as categoriesRouter };
