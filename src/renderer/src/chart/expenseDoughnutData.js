import data from '../../../../data.js';

const records = data.church_expense_tracker.records;

const expenseRecords = records.filter(r => r.type === 'expense');

const expenseByCategory = {};
expenseRecords.forEach(r => {
  if (!expenseByCategory[r.category]) {
    expenseByCategory[r.category] = 0;
  }
  expenseByCategory[r.category] += r.amount;
});

const categories = Object.keys(expenseByCategory);
const values = Object.values(expenseByCategory);

const doughnutColors = [
  'rgba(239, 68, 68, 0.7)',
  'rgba(249, 115, 22, 0.7)',
  'rgba(234, 179, 8, 0.7)',
  'rgba(132, 204, 22, 0.7)',
  'rgba(34, 197, 94, 0.7)',
  'rgba(6, 182, 212, 0.7)',
  'rgba(99, 102, 241, 0.7)',
  'rgba(168, 85, 247, 0.7)',
  'rgba(236, 72, 153, 0.7)',
  'rgba(148, 163, 184, 0.7)',
];

const borderColors = doughnutColors.map(c => c.replace('0.7', '1'));

const expenseDoughnutData = {
  labels: categories,
  datasets: [
    {
      label: 'Expenses',
      data: values,
      backgroundColor: categories.map((_, i) => doughnutColors[i % doughnutColors.length]),
      borderColor: categories.map((_, i) => borderColors[i % borderColors.length]),
      borderWidth: 2,
    },
  ],
};

export default expenseDoughnutData;