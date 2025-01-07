import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const SpeedGraph = ({ runs }) => {
  // Check if runs data is available
  if (!runs || runs.length < 2) {
    return <p>Not enough data for speed visualization</p>;
  }

  // Prepare data for the chart
  const labels = runs.map(run => new Date(run.date).toLocaleDateString());
  const speeds = runs.map(run => (run.distance / (run.duration / 60)).toFixed(2)); // Convert minutes to hours

  const data = {
    labels,
    datasets: [
      {
        label: 'Average Speed (km/h)',
        data: speeds,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Speed Over Time',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default SpeedGraph;
