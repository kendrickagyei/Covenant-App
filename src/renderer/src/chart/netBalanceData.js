import data from '../../../../data.js';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildMonthKey = (date) => {
  const year = date.getFullYear();
  const month = monthLabels[date.getMonth()];
  return `${month} ${year}`;
};

const buildNetBalanceData = (records = data.church_expense_tracker.records) => {
  const balanceByMonth = new Map();

  records.forEach((record) => {
    const date = new Date(`${record.date}T12:00:00`);
    const key = buildMonthKey(date);
    const current = balanceByMonth.get(key) || 0;
    const nextValue = record.type === 'income' ? current + record.amount : current - record.amount;
    balanceByMonth.set(key, nextValue);
  });

  const labels = Array.from(balanceByMonth.keys());
  const values = Array.from(balanceByMonth.values());

  return {
    labels,
    datasets: [
      {
        label: 'Net Balance',
        data: values,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 2,
        borderRadius: 0,
      },
    ],
  };
};

export default buildNetBalanceData;
