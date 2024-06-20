// src/components/AccountValueGraph.js
import React from 'react';
import { Line } from 'react-chartjs-2';

const AccountValueGraph = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.timestamp),
        datasets: [
            {
                label: 'Account Value',
                data: data.map(item => item.value),
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                fill: false,
            },
        ],
    };

    return <Line data={chartData} />;
};

export default AccountValueGraph;
