// src/components/CandleChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const CandleChart = ({ data }) => {
    const chartData = {
        labels: data.map(candle => new Date(candle.timestamp).toLocaleString()),
        datasets: [
            {
                label: 'Close Price',
                data: data.map(candle => candle.close),
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                fill: false,
            },
        ],
    };

    return <Line data={chartData} />;
};

export default CandleChart;
