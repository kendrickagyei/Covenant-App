import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import buildNetBalanceData from '../data/netBalanceData.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Monthly Net Balance',
      font: { style: 'normal', size: 15, weight: 'bold' },
      padding: { bottom: 10 },
      color: '#111827', // hardcoded — does NOT respond to dark mode (known limitation of Chart.js static options)
    },
    legend: { display: false },
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

const NetBalanceChart = ({ records }) => {
  return <Bar data={buildNetBalanceData(records)} options={options} />;
};

export default NetBalanceChart;
