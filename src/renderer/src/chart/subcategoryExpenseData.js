import data from '../../../../data.js';

const buildSubcategoryExpenseData = (records = data.church_expense_tracker.records) => {
  const expenseRecords = records.filter((r) => r.type === 'expense');

  const expenseBySubcategory = {};
  expenseRecords.forEach((r) => {
    if (!expenseBySubcategory[r.subcategory]) {
      expenseBySubcategory[r.subcategory] = 0;
    }
    expenseBySubcategory[r.subcategory] += r.amount;
  });

  const sorted = Object.entries(expenseBySubcategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  const labels = sorted.map(([sub]) => sub);
  const dataValues = sorted.map(([, val]) => val);

  const barColors = [
    'rgba(239, 68, 68, 0.18)',
    'rgba(249, 115, 22, 0.18)',
    'rgba(234, 179, 8, 0.18)',
    'rgba(132, 204, 22, 0.18)',
    'rgba(34, 197, 94, 0.18)',
    'rgba(6, 182, 212, 0.18)',
    'rgba(99, 102, 241, 0.18)',
    'rgba(168, 85, 247, 0.18)',
    'rgba(236, 72, 153, 0.18)',
    'rgba(148, 163, 184, 0.18)',
    'rgba(239, 68, 68, 0.12)',
    'rgba(249, 115, 22, 0.12)',
    'rgba(234, 179, 8, 0.12)',
    'rgba(132, 204, 22, 0.12)',
    'rgba(34, 197, 94, 0.12)',
    'rgba(6, 182, 212, 0.12)',
    'rgba(99, 102, 241, 0.12)',
    'rgba(168, 85, 247, 0.12)',
    'rgba(236, 72, 153, 0.12)',
    'rgba(148, 163, 184, 0.12)',
  ];

  const borderColors = [
    'rgba(239, 68, 68, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(234, 179, 8, 1)',
    'rgba(132, 204, 22, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(99, 102, 241, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(148, 163, 184, 1)',
    'rgba(239, 68, 68, 1)',
    'rgba(249, 115, 22, 1)',
    'rgba(234, 179, 8, 1)',
    'rgba(132, 204, 22, 1)',
    'rgba(34, 197, 94, 1)',
    'rgba(6, 182, 212, 1)',
    'rgba(99, 102, 241, 1)',
    'rgba(168, 85, 247, 1)',
    'rgba(236, 72, 153, 1)',
    'rgba(148, 163, 184, 1)',
  ];

  return {
    labels,
    datasets: [
      {
        label: 'GHS',
        data: dataValues,
        backgroundColor: labels.map((_, i) => barColors[i % barColors.length]),
        borderColor: labels.map((_, i) => borderColors[i % borderColors.length]),
        borderWidth: 2,
        borderSkipped: false,
        barPercentage: 0.45,
        categoryPercentage: 0.72,
        maxBarThickness: 18,
      },
    ],
  };
};

export default buildSubcategoryExpenseData;
