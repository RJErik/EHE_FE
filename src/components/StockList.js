// src/components/StockList.js
import React from 'react';

const StockList = ({ stocks }) => {
    return (
        <div>
            <h2>Stock List</h2>
            <ul>
                {stocks.map((stock, index) => (
                    <li key={index}>{stock}</li>
                ))}
            </ul>
        </div>
    );
};

export default StockList;
