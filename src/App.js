// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Navigation from './components/Navigation';
import CandleChart from './components/CandleChart';
import VolumeChart from './components/VolumeChart';
import StockList from './components/StockList';
import AccountValueGraph from './components/AccountValueGraph';
import BuySellPanel from './components/BuySellPanel';
import Footer from './components/Footer';
import './styles.css';

const App = () => {
  const [data, setData] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [accountValue, setAccountValue] = useState([]);

  useEffect(() => {
    // Fetch stock data from the backend
    axios.get('/api/stock-data')
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });

    // Fetch account value data from the backend
    axios.get('/api/account-value')
        .then(response => {
          setAccountValue(response.data);
        })
        .catch(error => {
          console.error('Error fetching account value data:', error);
        });

    // Fetch list of stocks from the backend
    axios.get('/api/stocks')
        .then(response => {
          setStocks(response.data);
        })
        .catch(error => {
          console.error('Error fetching stocks:', error);
        });
  }, []);

  return (
      <div className="App">
        <Header />
        <Navigation />
        <div className="main-content">
          <div className="chart-section">
            <CandleChart data={data} />
            <VolumeChart data={data} />
          </div>
          <div className="side-panel">
            <StockList stocks={stocks} />
            <AccountValueGraph data={accountValue} />
            <BuySellPanel />
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default App;
