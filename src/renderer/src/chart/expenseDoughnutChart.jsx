import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import expenseDoughnutData from './expenseDoughnutData.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Expense by Category',
      font: { style: 'normal', size: 15, weight: 'bold' },
      padding: { bottom: 10 },
      color: '#111827',
    },
    legend: {
      position: 'bottom',
      labels: {
        font: { style: 'normal' },
        padding: 14,
        usePointStyle: true,
        boxWidth: 10,
      },
    },
  },
  cutout: '60%',
};

const ExpenseDoughnutChart = () => {
  return <Doughnut data={expenseDoughnutData} options={options} />;
};

export default ExpenseDoughnutChart;