import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, Title, PointElement, LineElement } from "chart.js";
import { Line } from "react-chartjs-2";
import lineChartData from './data'
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);
const options = {}

const LineGraph = () => {
  return (
    <div>
      <Line options={options} data={lineChartData} />
    </div>
  )
}

export default LineGraph