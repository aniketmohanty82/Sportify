import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RunDistanceChart = ({ runs }) => {
  // Check if runs data is available
  if (!runs || runs.length < 1) {
    return <p>Not enough data for distance visualization</p>;
  }

  // Prepare data for the chart
  const labels = runs.map(run => new Date(run.date).toLocaleDateString());
  const distances = runs.map(run => run.distance);

  const data = {
    labels,
    datasets: [
      {
        label: 'Distance (km)',
        data: distances,
        backgroundColor: 'rgba(26, 166, 75, 0.8)',
        borderColor: 'rgba(26, 166, 75, 1)',
        borderWidth: 1,
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
        text: 'Distance Covered Over Time',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default RunDistanceChart;
