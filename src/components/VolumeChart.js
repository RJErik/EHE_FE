// src/components/VolumeChart.js
import React from 'react';
import { Bar } from 'react-chartjs-2';

const VolumeChart = ({ data }) => {
    const chartData = {
        labels: data.map(candle => candle.timestamp),
        datasets: [
            {
                label: 'Volume',
                data: data.map(candle => candle.volume),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return <Bar data={chartData} />;
};

export default VolumeChart;
