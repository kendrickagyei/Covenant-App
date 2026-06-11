import data from '../../../../data.js';

const records = data.church_expense_tracker.records;

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

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

const netBalanceByMonth = monthNames.map(m => incomeByMonth[m] - expenseByMonth[m]);

const netBalanceData = {
  labels: monthNames,
  datasets: [
    {
      label: 'Net Balance',
      data: netBalanceByMonth,
      backgroundColor: 'rgba(59, 130, 246, 0.7)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      borderRadius: 0,
    },
  ],
};

export default netBalanceData;