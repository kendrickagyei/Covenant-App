import data from '../../../../data.js';

const buildDoughnutData = (records = data.church_expense_tracker.records) => {
  const incomeRecords = records.filter((r) => r.type === 'income');

  const incomeByCategory = {};
  incomeRecords.forEach((r) => {
    if (!incomeByCategory[r.category]) {
      incomeByCategory[r.category] = 0;
    }
    incomeByCategory[r.category] += r.amount;
  });

  const categories = Object.keys(incomeByCategory);
  const values = Object.values(incomeByCategory);

  const doughnutColors = [
    'rgba(255, 99, 132, 0.7)',
    'rgba(54, 162, 235, 0.7)',
    'rgba(255, 205, 86, 0.7)',
    'rgba(75, 192, 192, 0.7)',
    'rgba(153, 102, 255, 0.7)',
    'rgba(255, 159, 64, 0.7)',
    'rgba(201, 203, 207, 0.7)',
  ];

  const borderColors = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 205, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(201, 203, 207, 1)',
  ];

  return {
    labels: categories,
    datasets: [
      {
        label: 'Income',
        data: values,
        backgroundColor: categories.map((_, i) => doughnutColors[i % doughnutColors.length]),
        borderColor: categories.map((_, i) => borderColors[i % borderColors.length]),
        borderWidth: 2,
      },
    ],
  };
};

export default buildDoughnutData;
