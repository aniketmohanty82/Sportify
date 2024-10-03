// CaloriesChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CaloriesChart = ({ calorieData }) => {
  // Prepare data for the chart
  const labels = calorieData.map(entry => entry.date); // Array of dates for the x-axis
  const dataValues = calorieData.map(entry => entry.calories); // Array of calorie counts for the y-axis

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Calories',
        data: dataValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
        text: 'Calories Consumed Over the Past 7 Days',
      },
    },
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default CaloriesChart;
