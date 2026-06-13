import  data  from './data.js';

const records = data.church_expense_tracker.records;

// --- Get unique categories directly from records ---
const categories = [...new Set(
  records
    .filter(r => r.type === 'expense')
    .map(r => r.category)
)];

console.log(categories);
// ['Utilities', 'Welfare', 'Stationery', 'Maintenance', 'Transport',
//  'Evangelism', 'Catering', 'Equipment', 'Salaries', 'Others']

// --- Map each category into a clean array ---
const groupedExpenses = categories.map(category => {
  const total = records
    .filter(r => r.type === 'expense' && r.category === category)
    .reduce((sum, r) => sum + r.amount, 0);

  return { label: category, total };
});

console.log(groupedExpenses);
// [
//   { label: 'Utilities',  total: 1645 },
//   { label: 'Welfare',    total: 3950 },
//   { label: 'Stationery', total: 480  },
//   ...
// ]

// --- Pull out labels and values when ready ---
export default {groupedExpenses,categories}