import data from '../../../../data.js';

const records = data.church_expense_tracker.records;

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

// Initialize monthly totals
const incomeByMonth = {};
const expenseByMonth = {};
monthNames.forEach(m => {
  incomeByMonth[m] = 0;
  expenseByMonth[m] = 0;
});

records.forEach(r => {
  const date = new Date(r.date);
  const month = monthNames[date.getMonth()];
  if (r.type === 'income') {
    incomeByMonth[month] += r.amount;
  } else {
    expenseByMonth[month] += r.amount;
  }
});

const monthlyLineData = {
  labels: monthNames,
  datasets: [
    {
      label: 'Income',
      data: monthNames.map(m => incomeByMonth[m]),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(59, 130, 246)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 4,
      tension: 0.3,
      fill: true,
    },
    {
      label: 'Expense',
      data: monthNames.map(m => expenseByMonth[m]),
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(239, 68, 68)',
      pointBorderColor: '#fff',
      pointBorderWidth: 1,
      pointRadius: 4,
      tension: 0.3,
      fill: true,
    },
  ],
};

export default monthlyLineData;