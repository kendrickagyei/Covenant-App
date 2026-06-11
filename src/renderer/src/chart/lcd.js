
import cd from '../../../../cd.js';

const { groupedExpenses } = cd;

const lineChartData = {
  labels: groupedExpenses.map(d => d.label),
  datasets: [
    {
      label: "Expenses",
      data: groupedExpenses.map(d => d.total),
      borderColor: "rgb(75, 192, 192)",
      backgroundColor: "rgba(75,192,192,0.2)",
      fill: true,
    },
  ],
};

export default lineChartData;