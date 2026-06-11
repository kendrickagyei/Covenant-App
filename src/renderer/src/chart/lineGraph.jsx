import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import lineChartData from './lcd.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
const options = {
   plugins: {
    legend: {
      labels: {
        font: {
          style: 'normal'
        }
      }
    }
  }
};

const LineGraph = () => {
  return <Line data={lineChartData} options={options} />;
};

export default LineGraph;

