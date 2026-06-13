/**
 * Build Chart.js bar data for the monthly net balance (income - expense per month).
 *
 * Groups records by month, subtracts expenses from income,
 * and returns labels + data sorted chronologically.
 * Accepts any records array — no longer has a hardcoded import of data.js.
 */
const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildMonthKey = (date) => {
  const year = date.getFullYear();
  const month = monthLabels[date.getMonth()];
  return `${month} ${year}`;
};

const buildNetBalanceData = (records = []) => {
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
