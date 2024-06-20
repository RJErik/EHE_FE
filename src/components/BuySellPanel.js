// src/components/BuySellPanel.js
import React, { useState } from 'react';

const BuySellPanel = () => {
    const [buyAmount, setBuyAmount] = useState(0);
    const [sellAmount, setSellAmount] = useState(0);

    const handleBuy = () => {
        // Implement buy logic here
        console.log(`Buying ${buyAmount} units`);
    };

    const handleSell = () => {
        // Implement sell logic here
        console.log(`Selling ${sellAmount} units`);
    };

    return (
        <div>
            <h2>Buy/Sell Panel</h2>
            <div>
                <input
                    type="number"
                    value={buyAmount}
                    onChange={e => setBuyAmount(e.target.value)}
                    placeholder="Buy amount"
                />
                <button onClick={handleBuy}>Buy</button>
            </div>
            <div>
                <input
                    type="number"
                    value={sellAmount}
                    onChange={e => setSellAmount(e.target.value)}
                    placeholder="Sell amount"
                />
                <button onClick={handleSell}>Sell</button>
            </div>
        </div>
    );
};

export default BuySellPanel;
