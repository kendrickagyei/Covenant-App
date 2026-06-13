import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import buildSubcategoryExpenseData from './subcategoryExpenseData.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
  layout: {
    padding: { top: 6, right: 6, bottom: 2, left: 2 },
  },
  plugins: {
    title: {
      display: true,
      text: 'Top 15 Subcategory Expenses',
      font: { style: 'normal', size: 15, weight: 'bold' },
      padding: { bottom: 10 },
      color: '#111827',
      align: 'start',
    },
    legend: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: 'rgba(0, 0, 0, 0.08)' },
      ticks: {
        font: { style: 'normal', size: 12 },
        padding: 2,
      },
    },
    y: {
      grid: { display: false },
      ticks: {
        font: { style: 'normal', size: 13 },
        padding: 2,
        align: 'center',
        crossAlign: 'center',
      },
    },
  },
};

const SubcategoryExpenseChart = ({ records }) => {
  return <Bar data={buildSubcategoryExpenseData(records)} options={options} />;
};

export default SubcategoryExpenseChart;
