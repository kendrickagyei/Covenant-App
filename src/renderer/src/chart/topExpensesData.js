import data from '../../../../data.js';

const buildTopExpensesData = (records = data.church_expense_tracker.records) => {
  const expenseRecords = records.filter((r) => r.type === 'expense');

  const expenseByCategory = {};
  expenseRecords.forEach((r) => {
    if (!expenseByCategory[r.category]) {
      expenseByCategory[r.category] = 0;
    }
    expenseByCategory[r.category] += r.amount;
  });

  const sorted = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = sorted.map(([cat]) => cat);
  const dataValues = sorted.map(([, val]) => val);

  const barColors = [
    'rgba(239, 68, 68, 0.75)',
    'rgba(249, 115, 22, 0.75)',
    'rgba(234, 179, 8, 0.75)',
    'rgba(34, 197, 94, 0.75)',
    'rgba(99, 102, 241, 0.75)',
  ];

  return {
    labels,
    datasets: [
      {
        label: 'GHS',
        data: dataValues,
        backgroundColor: barColors,
        borderWidth: 0,
        borderRadius: 0,
      },
    ],
  };
};

export default buildTopExpensesData;
