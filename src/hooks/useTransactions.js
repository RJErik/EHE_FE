// src/hooks/useTransactions.js
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { useJwtRefresh } from "./useJwtRefresh";

export function useTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { toast } = useToast();
    const { refreshToken } = useJwtRefresh();

    const fetchTransactions = useCallback(async (page = 0, size = pageSize) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Fetching transactions... page=${page}, size=${size}`);
            let response = await fetch(`http://localhost:8080/api/admin/transactions?page=${page}&size=${size}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    throw new Error("Session expired. Please login again.");
                }

                response = await fetch(`http://localhost:8080/api/admin/transactions?page=${page}&size=${size}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

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
                setTransactions(data.transactions?.content || []);
                setCurrentPage(data.transactions?.number || 0);
                setTotalPages(data.transactions?.totalPages || 1);
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
    }, [toast, refreshToken, pageSize]);

    const searchTransactions = async (userId, portfolioId, platform, symbol, fromTime, toTime, fromAmount, toAmount, fromPrice, toPrice, type, status, page = 0, size = pageSize) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Searching transactions: userId=${userId} portfolioId=${portfolioId} platform=${platform}, symbol=${symbol}, page=${page}, size=${size}`);

            const params = new URLSearchParams();
            if (userId && userId !== "_any_") params.append("userId", userId);
            if (portfolioId && portfolioId !== "_any_") params.append("portfolioId", portfolioId);
            if (platform && platform !== "_any_") params.append("platform", platform);
            if (symbol && symbol !== "_any_") params.append("symbol", symbol);
            if (fromTime && fromTime !== "_any_") params.append("fromTime", fromTime);
            if (toTime && toTime !== "_any_") params.append("toTime", toTime);
            if (fromAmount && fromAmount !== "_any_") params.append("fromAmount", fromAmount);
            if (toAmount && toAmount !== "_any_") params.append("toAmount", toAmount);
            if (fromPrice && fromPrice !== "_any_") params.append("fromPrice", fromPrice);
            if (toPrice && toPrice !== "_any_") params.append("toPrice", toPrice);
            if (type && type !== "_any_") params.append("type", type);
            if (status && status !== "_any_") params.append("status", status);
            params.append("page", page);
            params.append("size", size);

            let response = await fetch(`http://localhost:8080/api/admin/transactions/search?${params.toString()}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    throw new Error("Session expired. Please login again.");
                }

                response = await fetch(`http://localhost:8080/api/admin/transactions/search?${params.toString()}`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

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
                setTransactions(data.transactions?.content || []);
                setCurrentPage(data.transactions?.number || 0);
                setTotalPages(data.transactions?.totalPages || 1);
                return data.transactions?.content || [];
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

    useEffect(() => {
        console.log("Initial transactions fetch...");
        fetchTransactions(0, pageSize);
    }, [fetchTransactions, pageSize]);

    return {
        transactions,
        isLoading,
        error,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        fetchTransactions,
        searchTransactions
    };
}