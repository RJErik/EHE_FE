import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTransactions as useTransactionHook } from '../hooks/useTransactions.js';

// Create the context
const TransactionsContext = createContext(null);

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
        portfolioId: '',
        platform: '',
        symbol: '',
        fromTime: '',
        toTime: '',
        fromAmount: '',
        toAmount: '',
        fromPrice: '',
        toPrice: '',
        type: '',
        status: '',
        page: 0, // 0-based
        size: 10
    });

    // Force a re-render when transactions change
    useEffect(() => {
        setLastUpdate(Date.now());
    }, [transactionData.transactions]);

    // Create a method to refresh using the last search parameters
    const refreshLatestSearch = useCallback(() => {
        console.log('[TransactionsContext] Refreshing with last search:', lastSearchParamsRef.current);

        if (lastSearchParamsRef.current.requestType === 'search') {
            transactionData.searchTransactions(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.portfolioId,
                lastSearchParamsRef.current.platform,
                lastSearchParamsRef.current.symbol,
                lastSearchParamsRef.current.fromTime,
                lastSearchParamsRef.current.toTime,
                lastSearchParamsRef.current.fromAmount,
                lastSearchParamsRef.current.toAmount,
                lastSearchParamsRef.current.fromPrice,
                lastSearchParamsRef.current.toPrice,
                lastSearchParamsRef.current.type,
                lastSearchParamsRef.current.status,
                lastSearchParamsRef.current.page,
                lastSearchParamsRef.current.size
            );
        } else {
            transactionData.fetchTransactions(
                lastSearchParamsRef.current.page,
                lastSearchParamsRef.current.size
            );
        }
    }, [transactionData]);

    // Extended search function that stores the parameters and resets to page 0
    const searchTransactionsWithMemory = useCallback((userId, portfolioId, platform, symbol, fromTime, toTime, fromAmount, toAmount, fromPrice, toPrice, type, status) => {
        lastSearchParamsRef.current = {
            requestType: 'search',
            userId,
            portfolioId,
            platform,
            symbol,
            fromTime,
            toTime,
            fromAmount,
            toAmount,
            fromPrice,
            toPrice,
            type,
            status,
            page: 0, // Always start at page 0 for new search
            size: transactionData.pageSize
        };
        return transactionData.searchTransactions(userId, portfolioId, platform, symbol, fromTime, toTime, fromAmount, toAmount, fromPrice, toPrice, type, status, 0, transactionData.pageSize);
    }, [transactionData]);

    // Extended fetch function that stores it was a general fetch and resets to page 0
    const fetchTransactionsWithMemory = useCallback(() => {
        lastSearchParamsRef.current = {
            requestType: 'fetchAll',
            userId: '',
            portfolioId: '',
            platform: '',
            symbol: '',
            fromTime: '',
            toTime: '',
            fromAmount: '',
            toAmount: '',
            fromPrice: '',
            toPrice: '',
            type: '',
            status: '',
            page: 0, // Always start at page 0
            size: transactionData.pageSize
        };
        return transactionData.fetchTransactions(0, transactionData.pageSize);
    }, [transactionData]);

    // Navigate to a specific page (0-based internally)
    const goToPage = useCallback((page) => {
        // Ensure page is within bounds (0-based)
        const validPage = Math.max(0, Math.min(page, transactionData.totalPages - 1));

        lastSearchParamsRef.current.page = validPage;

        if (lastSearchParamsRef.current.requestType === 'search') {
            transactionData.searchTransactions(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.portfolioId,
                lastSearchParamsRef.current.platform,
                lastSearchParamsRef.current.symbol,
                lastSearchParamsRef.current.fromTime,
                lastSearchParamsRef.current.toTime,
                lastSearchParamsRef.current.fromAmount,
                lastSearchParamsRef.current.toAmount,
                lastSearchParamsRef.current.fromPrice,
                lastSearchParamsRef.current.toPrice,
                lastSearchParamsRef.current.type,
                lastSearchParamsRef.current.status,
                validPage,
                transactionData.pageSize
            );
        } else {
            transactionData.fetchTransactions(validPage, transactionData.pageSize);
        }
    }, [transactionData]);

    // Change page size and calculate which page to show
    const changePageSize = useCallback((newSize) => {
        const currentFirstItemIndex = transactionData.currentPage * transactionData.pageSize;
        const newPage = Math.floor(currentFirstItemIndex / newSize);
        const validPage = Math.max(0, newPage);

        transactionData.setPageSize(newSize);
        lastSearchParamsRef.current.size = newSize;
        lastSearchParamsRef.current.page = validPage;

        if (lastSearchParamsRef.current.requestType === 'search') {
            transactionData.searchTransactions(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.portfolioId,
                lastSearchParamsRef.current.platform,
                lastSearchParamsRef.current.symbol,
                lastSearchParamsRef.current.fromTime,
                lastSearchParamsRef.current.toTime,
                lastSearchParamsRef.current.fromAmount,
                lastSearchParamsRef.current.toAmount,
                lastSearchParamsRef.current.fromPrice,
                lastSearchParamsRef.current.toPrice,
                lastSearchParamsRef.current.type,
                lastSearchParamsRef.current.status,
                validPage,
                newSize
            );
        } else {
            transactionData.fetchTransactions(validPage, newSize);
        }
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
        goToPage,
        changePageSize,
        refreshInterval,
        updateRefreshInterval,
        refreshIntervalOptions: Object.keys(REFRESH_INTERVALS)
    };

    return (
        <TransactionsContext.Provider value={contextValue}>
            {children}
        </TransactionsContext.Provider>
    );
}

// Custom hook to use the transaction context
export function useTransaction() {
    const context = useContext(TransactionsContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
}