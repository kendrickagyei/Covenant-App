import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import doughnutChartData from './doughnutData.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: 'Income by Category',
      font: { style: 'normal', size: 16, weight: 'bold' },
      padding: { bottom: 12 },
      color: '#111827',
    },
    legend: {
      position: 'bottom',
      labels: {
        font: { style: 'normal' },
        padding: 16,
        usePointStyle: true,
      },
    },
  },
  cutout: '60%',
};

const DoughnutChart = () => {
  return <Doughnut data={doughnutChartData} options={options} />;
};

export default DoughnutChart;