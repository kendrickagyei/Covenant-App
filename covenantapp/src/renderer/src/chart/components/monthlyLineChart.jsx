import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import buildMonthlyLineData from '../data/monthlyLineData.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Income vs Expense by Month',
      font: { style: 'normal', size: 15, weight: 'bold' },
      padding: { bottom: 10 },
      color: '#111827',
    },
    legend: {
      position: 'top',
      labels: {
        font: { style: 'normal' },
        padding: 12,
        usePointStyle: true,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: { style: 'normal' },
      },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: { style: 'normal' },
      },
      grid: { color: 'rgba(0, 0, 0, 0.06)' },
    },
  },
};

const MonthlyLineChart = ({ records }) => {
  const data = buildMonthlyLineData(records || []);
  return <Line data={data} options={options} />;
};

export default MonthlyLineChart;
