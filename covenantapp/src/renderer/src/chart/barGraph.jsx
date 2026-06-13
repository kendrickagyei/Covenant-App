import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.defaults.font.style = "normal";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const barColors = [
  'rgba(255, 99, 132, 0.18)',
  'rgba(255, 159, 64, 0.18)',
  'rgba(255, 205, 86, 0.18)',
  'rgba(75, 192, 192, 0.18)',
  'rgba(54, 162, 235, 0.18)',
  'rgba(153, 102, 255, 0.18)',
  'rgba(201, 203, 207, 0.18)',
];

const borderColors = [
  'rgba(255, 99, 132, 1)',
  'rgba(255, 159, 64, 1)',
  'rgba(255, 205, 86, 1)',
  'rgba(75, 192, 192, 1)',
  'rgba(54, 162, 235, 1)',
  'rgba(153, 102, 255, 1)',
  'rgba(201, 203, 207, 1)',
];

const buildChartData = (records = []) => {
  const expenseRecords = records.filter((record) => record.type === 'expense');
  const expenseByCategory = {};

  expenseRecords.forEach((record) => {
    if (!expenseByCategory[record.category]) {
      expenseByCategory[record.category] = 0;
    }
    expenseByCategory[record.category] += record.amount;
  });

  const groupedExpenses = Object.entries(expenseByCategory).map(([label, total]) => ({ label, total }));

  return {
    labels: groupedExpenses.map((d) => d.label),
    datasets: [
      {
        label: 'Expenses',
        data: groupedExpenses.map((d) => d.total),
        backgroundColor: groupedExpenses.map((_, index) => barColors[index % barColors.length]),
        borderColor: groupedExpenses.map((_, index) => borderColors[index % borderColors.length]),
        borderWidth: 2,
        borderSkipped: false,
        barPercentage: 0.72,
        categoryPercentage: 0.8,
        maxBarThickness: 110,
      },
    ],
  };
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
  scales: {
    x: {
      position: 'bottom',
      grid: { display: true, color: 'rgba(0, 0, 0, 0.08)' },
      ticks: {
        font: { style: 'normal' },
        autoSkip: false,
        align: 'center',
        crossAlign: 'center',
        maxRotation: 0,
        minRotation: 0,
        padding: 8,
      },
    },
    y: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.08)' },
    },
  },
};

const BarGraph = ({ records }) => {
  return <Bar data={buildChartData(records)} options={options} />;
};

export default BarGraph;
