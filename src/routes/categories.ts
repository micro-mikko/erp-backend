import { Router } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const TRANSACTION_CATEGORIES = [
  {
    id: 'revenue',
    label: 'Intäkter',
    subcategories: [
      { id: 'revenue_products', label: 'Produktförsäljning', accounts: { debit: '1910', credit: '3000' } },
      { id: 'revenue_consulting', label: 'Tjänsteförsäljning / Consulting', accounts: { debit: '1910', credit: '3010' } },
      { id: 'revenue_recurring', label: 'Återkommande intäkter (SaaS/abonnemang)', accounts: { debit: '1910', credit: '3020' } },
      { id: 'revenue_interest', label: 'Ränteintäkter', accounts: { debit: '1910', credit: '3030' } }
    ]
  },
  {
    id: 'personnel',
    label: 'Personalkostnader',
    subcategories: [
      { id: 'personnel_salary', label: 'Löner', accounts: { debit: '5000', credit: '1910' } },
      { id: 'personnel_social', label: 'Arbetsgivaravgifter', accounts: { debit: '5100', credit: '2940' } },
      { id: 'personnel_pension', label: 'Pensionskostnader', accounts: { debit: '5200', credit: '2950' } },
      { id: 'personnel_travel', label: 'Reseersättning', accounts: { debit: '5300', credit: '1910' } }
    ]
  },
  {
    id: 'premises',
    label: 'Lokalkostnader',
    subcategories: [
      { id: 'premises_rent', label: 'Hyra', accounts: { debit: '5400', credit: '1910' } },
      { id: 'premises_energy', label: 'El & värme', accounts: { debit: '5410', credit: '1910' } },
      { id: 'premises_cleaning', label: 'Städning & underhåll', accounts: { debit: '5420', credit: '1910' } }
    ]
  },
  {
    id: 'it',
    label: 'IT & Kommunikation',
    subcategories: [
      { id: 'it_software', label: 'Programvarulicenser (SaaS)', accounts: { debit: '5500', credit: '1910' } },
      { id: 'it_phone', label: 'Telefon & internet', accounts: { debit: '5510', credit: '1910' } },
      { id: 'it_hardware', label: 'Hårdvara & utrustning', accounts: { debit: '5520', credit: '1910' } }
    ]
  },
  {
    id: 'marketing',
    label: 'Försäljning & Marknadsföring',
    subcategories: [
      { id: 'marketing_ads', label: 'Annonsering', accounts: { debit: '5600', credit: '1910' } },
      { id: 'marketing_events', label: 'Mässor & events', accounts: { debit: '5610', credit: '1910' } },
      { id: 'marketing_representation', label: 'Representationskostnader', accounts: { debit: '5620', credit: '1910' } }
    ]
  },
  {
    id: 'admin',
    label: 'Administration',
    subcategories: [
      { id: 'admin_accounting', label: 'Bokföringstjänster', accounts: { debit: '5700', credit: '1910' } },
      { id: 'admin_legal', label: 'Juridiska tjänster', accounts: { debit: '5710', credit: '1910' } },
      { id: 'admin_office', label: 'Kontorsmaterial', accounts: { debit: '5720', credit: '1910' } },
      { id: 'admin_bank', label: 'Bankavgifter', accounts: { debit: '5730', credit: '1910' } }
    ]
  },
  {
    id: 'tax',
    label: 'Skatter & Moms',
    subcategories: [
      { id: 'tax_vat', label: 'Momsbetalning', accounts: { debit: '2939', credit: '1910' } },
      { id: 'tax_prepaid', label: 'Förskottsskatt', accounts: { debit: '2910', credit: '1910' } }
    ]
  },
  {
    id: 'owner',
    label: 'Ägaruttag',
    subcategories: [
      { id: 'owner_dividend', label: 'Dividend / Utdelning', accounts: { debit: '2000', credit: '1910' } },
      { id: 'owner_loan_in', label: 'Aktieägarens lån till bolaget', accounts: { debit: '1910', credit: '2800' } },
      { id: 'owner_loan_out', label: 'Återbetalning av lån', accounts: { debit: '2800', credit: '1910' } }
    ]
  },
  {
    id: 'other',
    label: 'Övrigt',
    subcategories: [
      { id: 'other_depreciation', label: 'Avskrivningar', accounts: { debit: '6800', credit: '1200' } },
      { id: 'other_deposit', label: 'Bankinsättning', accounts: { debit: '1910', credit: '2000' } },
      { id: 'other_withdrawal', label: 'Uttag', accounts: { debit: '2000', credit: '1910' } }
    ]
  }
];

router.get('/', (req: AuthRequest, res) => {
  res.json(TRANSACTION_CATEGORIES);
});

export { router as categoriesRouter };
