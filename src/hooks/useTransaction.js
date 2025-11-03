// src/hooks/useTransaction.js
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { useJwtRefresh } from "./useJwtRefresh";

export function useTransaction() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { toast } = useToast();
    const { refreshToken } = useJwtRefresh();

    // Fetch all transactions
    const fetchTransactions = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Fetching transactions...");
            let response = await fetch("http://localhost:8080/api/admin/transactions", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            // Handle 401 - Token expired
            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    // Refresh failed - redirects to login automatically
                    throw new Error("Session expired. Please login again.");
                }

                // Retry the original request
                response = await fetch("http://localhost:8080/api/admin/transactions", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                // If still 401 after refresh, session is truly expired
                if (response.status === 401) {
                    throw new Error("Session expired. Please login again.");
                }
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Transactions received:", data);

            if (data.success) {
                setTransactions(data.transactions || []);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to fetch transactions",
                    variant: "destructive",
                });
                setError(data.message || "Failed to fetch transactions");
            }
        } catch (err) {
            console.error("Error fetching transactions:", err);
            if (!err.message?.includes("Session expired")) {
                setError("Failed to connect to server. Please try again later.");
                toast({
                    title: "Connection Error",
                    description: "Failed to fetch transactions. Server may be unavailable.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [toast, refreshToken]);

    // Search transactions
    const searchTransactions = async (userId, platform, symbol, fromTime, toTime, fromAmount, toAmount, fromPrice, toPrice, type, status) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Searching transactions: userId=${userId} platform=${platform}, symbol=${symbol} fromTime=${fromTime} 
            toTime=${toTime} fromAmount=${fromAmount} toAmount=${toAmount} fromPrie=${fromPrice} toPrice=${toPrice} 
            type=${type}, status=${status}`);

            let response = await fetch("http://localhost:8080/api/admin/transactions/search", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId === "_any_" ? "" : userId,
                    platform: platform === "_any_" ? "" : platform,
                    symbol: symbol === "_any_" ? "" : symbol,
                    fromTime: fromTime === "_any_" ? "" : fromTime,
                    toTime: toTime === "_any_" ? "" : toTime,
                    fromAmount: fromAmount === "_any_" ? "" : fromAmount,
                    toAmount: toAmount === "_any_" ? "" : toAmount,
                    fromPrice: fromPrice === "_any_" ? "" : fromPrice,
                    toPrice: toPrice === "_any_" ? "" : toPrice,
                    type: type === "_any_" ? "" : type,
                    status: status === "_any_" ? "" : status
                }),
            });

            // Handle 401 - Token expired
            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    // Refresh failed - redirects to login automatically
                    throw new Error("Session expired. Please login again.");
                }

                // Retry the original request
                response = await fetch("http://localhost:8080/api/admin/transactions/search", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId === "_any_" ? "" : userId,
                        platform: platform === "_any_" ? "" : platform,
                        symbol: symbol === "_any_" ? "" : symbol,
                        fromTime: fromTime === "_any_" ? "" : fromTime,
                        toTime: toTime === "_any_" ? "" : toTime,
                        fromAmount: fromAmount === "_any_" ? "" : fromAmount,
                        toAmount: toAmount === "_any_" ? "" : toAmount,
                        fromPrice: fromPrice === "_any_" ? "" : fromPrice,
                        toPrice: toPrice === "_any_" ? "" : toPrice,
                        type: type === "_any_" ? "" : type,
                        status: status === "_any_" ? "" : status
                    }),
                });

                // If still 401 after refresh, session is truly expired
                if (response.status === 401) {
                    throw new Error("Session expired. Please login again.");
                }
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Search results:", data);

            if (data.success) {
                setTransactions(data.transactions || []);
                return data.transactions || [];
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to search transactions",
                    variant: "destructive",
                });
                setError(data.message || "Failed to search transactions");
                return [];
            }
        } catch (err) {
            console.error("Error searching transactions:", err);
            if (!err.message?.includes("Session expired")) {
                setError("Failed to connect to server. Please try again later.");
                toast({
                    title: "Connection Error",
                    description: "Failed to search transactions. Server may be unavailable.",
                    variant: "destructive",
                });
            }
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    // Initial fetch
    useEffect(() => {
        console.log("Initial transactions fetch...");
        fetchTransactions();
    }, [fetchTransactions]);

    return {
        transactions,
        isLoading,
        error,
        fetchTransactions,
        searchTransactions
    };
}