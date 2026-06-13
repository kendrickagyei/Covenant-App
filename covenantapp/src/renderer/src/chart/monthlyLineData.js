/**
 * Build Chart.js line data for monthly income vs expense trends.
 *
 * Groups records by month, computes income and expense totals per month,
 * and only includes months that have data.
 * Accepts any records array — no longer has a hardcoded import of data.js.
 */
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const buildMonthlyLineData = (records = []) => {
  const incomeByMonth = {};
  const expenseByMonth = {};

  records.forEach((r) => {
    const date = new Date(`${r.date}T12:00:00`);
    const monthKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    if (r.type === 'income') {
      incomeByMonth[monthKey] = (incomeByMonth[monthKey] || 0) + r.amount;
    } else {
      expenseByMonth[monthKey] = (expenseByMonth[monthKey] || 0) + r.amount;
    }
  });

  // Collect all unique month keys and sort them chronologically
  const allMonths = new Set([...Object.keys(incomeByMonth), ...Object.keys(expenseByMonth)]);
  const sortedMonths = Array.from(allMonths).sort((a, b) => {
    // Sort by year then month index
    const parse = (s) => {
      const [m, y] = s.split(' ');
      return { y: Number(y), m: monthNames.indexOf(m) };
    };
    const pa = parse(a);
    const pb = parse(b);
    return pa.y !== pb.y ? pa.y - pb.y : pa.m - pb.m;
  });

  return {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map((m) => incomeByMonth[m] || 0),
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
        data: sortedMonths.map((m) => expenseByMonth[m] || 0),
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
};

export default buildMonthlyLineData;