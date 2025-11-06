import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTransaction as useTransactionHook } from '../hooks/useTransaction';

// Create the context
const TransactionContext = createContext(null);

// Refresh interval options in milliseconds
const REFRESH_INTERVALS = {
    off: null,
    '30s': 30000,
    '1m': 60000,
    '5m': 300000,
    '15m': 900000
};

// Provider component
export function TransactionProvider({ children }) {
    const transactionData = useTransactionHook();
    const [lastUpdate, setLastUpdate] = useState(Date.now());
    const [refreshInterval, setRefreshInterval] = useState('off');
    const refreshIntervalRef = useRef(null);

    // Use a ref for last search params to prevent unnecessary renders
    const lastSearchParamsRef = useRef({
        requestType: 'fetchAll',
        userId: '',
        portfolioId: '',  // ADD THIS
        platform: '',
        symbol: '',
        fromTime: '',
        toTime: '',
        fromAmount: '',
        toAmount: '',
        fromPrice: '',
        toPrice: '',
        type: '',
        status: ''
    });

    // Force a re-render when transactions change
    useEffect(() => {
        setLastUpdate(Date.now());
    }, [transactionData.transactions]);

    // Create a method to refresh using the last search parameters
    const refreshLatestSearch = useCallback(() => {
        console.log('[TransactionContext] Refreshing with last search:', lastSearchParamsRef.current);

        if (lastSearchParamsRef.current.requestType === 'search') {
            transactionData.searchTransactions(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.portfolioId,  // ADD THIS
                lastSearchParamsRef.current.platform,
                lastSearchParamsRef.current.symbol,
                lastSearchParamsRef.current.fromTime,
                lastSearchParamsRef.current.toTime,
                lastSearchParamsRef.current.fromAmount,
                lastSearchParamsRef.current.toAmount,
                lastSearchParamsRef.current.fromPrice,
                lastSearchParamsRef.current.toPrice,
                lastSearchParamsRef.current.type,
                lastSearchParamsRef.current.status
            );
        } else {
            transactionData.fetchTransactions();
        }
    }, [transactionData]);

    // Extended search function that stores the parameters
    const searchTransactionsWithMemory = useCallback((userId, portfolioId, platform, symbol, fromTime, toTime, fromAmount, toAmount, fromPrice, toPrice, type, status) => {
        lastSearchParamsRef.current = {
            requestType: 'search',
            userId,
            portfolioId,  // ADD THIS
            platform,
            symbol,
            fromTime,
            toTime,
            fromAmount,
            toAmount,
            fromPrice,
            toPrice,
            type,
            status
        };
        return transactionData.searchTransactions(userId, portfolioId, platform, symbol, fromTime, toTime, fromAmount, toAmount, fromPrice, toPrice, type, status);
    }, [transactionData]);

    // Extended fetch function that stores it was a general fetch
    const fetchTransactionsWithMemory = useCallback(() => {
        lastSearchParamsRef.current = {
            requestType: 'fetchAll',
            userId: '',
            portfolioId: '',  // ADD THIS
            platform: '',
            symbol: '',
            fromTime: '',
            toTime: '',
            fromAmount: '',
            toAmount: '',
            fromPrice: '',
            toPrice: '',
            type: '',
            status: ''
        };
        return transactionData.fetchTransactions();
    }, [transactionData]);

    // Handle refresh interval changes
    const updateRefreshInterval = useCallback((newInterval) => {
        console.log(`[TransactionContext] Updating refresh interval to: ${newInterval}`);
        setRefreshInterval(newInterval);

        // Clear existing interval
        if (refreshIntervalRef.current) {
            clearInterval(refreshIntervalRef.current);
            refreshIntervalRef.current = null;
        }

        // Set new interval if not "off"
        if (newInterval !== 'off' && REFRESH_INTERVALS[newInterval]) {
            refreshIntervalRef.current = setInterval(() => {
                console.log(`[TransactionContext] Auto-refresh triggered (${newInterval})`);
                refreshLatestSearch();
            }, REFRESH_INTERVALS[newInterval]);
        }
    }, [refreshLatestSearch]);

    // Cleanup interval on unmount
    useEffect(() => {
        return () => {
            if (refreshIntervalRef.current) {
                clearInterval(refreshIntervalRef.current);
                refreshIntervalRef.current = null;
            }
        };
    }, []);

    // Memoize the context value to prevent unnecessary renders
    const contextValue = {
        ...transactionData,
        lastUpdate,
        searchTransactions: searchTransactionsWithMemory,
        fetchTransactions: fetchTransactionsWithMemory,
        refreshLatestSearch,
        refreshInterval,
        updateRefreshInterval,
        refreshIntervalOptions: Object.keys(REFRESH_INTERVALS)
    };

    return (
        <TransactionContext.Provider value={contextValue}>
            {children}
        </TransactionContext.Provider>
    );
}

// Custom hook to use the transaction context
export function useTransaction() {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransaction must be used within a TransactionProvider');
    }
    return context;
}