import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import buildTopExpensesData from '../data/topExpensesData.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  plugins: {
    title: {
      display: true,
      text: 'Top 5 Spending Categories',
      font: { style: 'normal', size: 15, weight: 'bold' },
      padding: { bottom: 10 },
      color: '#111827',
    },
    legend: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        font: { style: 'normal' },
      },
      grid: { color: 'rgba(0, 0, 0, 0.06)' },
    },
    y: {
      ticks: {
        font: { style: 'normal', size: 12 },
      },
      grid: { display: false },
    },
  },
};

const TopExpensesChart = ({ records }) => {
  return <Bar data={buildTopExpensesData(records)} options={options} />;
};

export default TopExpensesChart;
