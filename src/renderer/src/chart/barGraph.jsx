import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import chartData from './lcd.js';
ChartJS.defaults.font.style = "normal";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
};

const BarGraph = () => {
  return <Bar data={chartData} options={options} />;
};

export default BarGraph;
