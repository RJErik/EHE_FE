// src/hooks/useUsers.js
import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { useJwtRefresh } from "./useJwtRefresh";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const { toast } = useToast();
    const { refreshToken } = useJwtRefresh();

    const fetchUsers = useCallback(async (page = 0, size = pageSize) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Fetching users... page=${page}, size=${size}`);
            let response = await fetch(`http://localhost:8080/api/admin/users?page=${page}&size=${size}`, {
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

                response = await fetch(`http://localhost:8080/api/admin/users?page=${page}&size=${size}`, {
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
            console.log("Users received:", data);

            if (data.success) {
                setUsers(data.users?.content || []);
                setCurrentPage(data.users?.number || 0);
                setTotalPages(data.users?.totalPages || 1);
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to fetch users",
                    variant: "destructive",
                });
                setError(data.message || "Failed to fetch users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            if (!err.message?.includes("Session expired")) {
                setError("Failed to connect to server. Please try again later.");
                toast({
                    title: "Connection Error",
                    description: "Failed to fetch users. Server may be unavailable.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, [toast, refreshToken, pageSize]);

    const searchUsers = useCallback(async (userId, username, email, accountStatus, registrationDateFromTime, registrationDateToTime, page = 0, size = pageSize) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Searching users: userId=${userId} username=${username} email=${email} accountStatus=${accountStatus} from=${registrationDateFromTime} to=${registrationDateToTime} page=${page} size=${size}`);

            let response = await fetch("http://localhost:8080/api/admin/users/search", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId === "_any_" ? null : userId,
                    userName: username === "_any_" ? null : username,
                    email: email === "_any_" ? null : email,
                    accountStatus: accountStatus === "_any_" ? null : accountStatus,
                    registrationDateFrom: registrationDateFromTime === "_any_" ? null : registrationDateFromTime,
                    registrationDateTo: registrationDateToTime === "_any_" ? null : registrationDateToTime,
                    page: page,
                    size: size
                }),
            });

            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    throw new Error("Session expired. Please login again.");
                }

                response = await fetch("http://localhost:8080/api/admin/users/search", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId === "_any_" ? null : userId,
                        userName: username === "_any_" ? null : username,
                        email: email === "_any_" ? null : email,
                        accountStatus: accountStatus === "_any_" ? null : accountStatus,
                        registrationDateFrom: registrationDateFromTime === "_any_" ? null : registrationDateFromTime,
                        registrationDateTo: registrationDateToTime === "_any_" ? null : registrationDateToTime,
                        page: page,
                        size: size
                    }),
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
                setUsers(data.users?.content || []);
                setCurrentPage(data.users?.number || 0);
                setTotalPages(data.users?.totalPages || 1);
                return data.users?.content || [];
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to search users",
                    variant: "destructive",
                });
                setError(data.message || "Failed to search users");
                return [];
            }
        } catch (err) {
            console.error("Error searching users:", err);
            if (!err.message?.includes("Session expired")) {
                setError("Failed to connect to server. Please try again later.");
                toast({
                    title: "Connection Error",
                    description: "Failed to search users. Server may be unavailable.",
                    variant: "destructive",
                });
            }
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [toast, refreshToken, pageSize]);

    const updateUser = useCallback(async (userId, username, email, password, accountStatus) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Updating user: userId=${userId}`);

            let response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userName: username || null,
                    email: email || null,
                    password: password || null,
                    accountStatus: accountStatus || null,
                }),
            });

            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    throw new Error("Session expired. Please login again.");
                }

                response = await fetch(`http://localhost:8080/api/admin/users/${userId}`, {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userName: username || null,
                        email: email || null,
                        password: password || null,
                        accountStatus: accountStatus || null,
                    }),
                });

                if (response.status === 401) {
                    throw new Error("Session expired. Please login again.");
                }
            }

            if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log("Update result:", data);

            if (data.success) {
                toast({
                    title: "Success",
                    description: data.message || "Users updated successfully",
                    variant: "default",
                });
                return data.user;
            } else {
                toast({
                    title: "Error",
                    description: data.message || "Failed to update user",
                    variant: "destructive",
                });
                setError(data.message || "Failed to update user");
                return null;
            }
        } catch (err) {
            console.error("Error updating user:", err);
            if (!err.message?.includes("Session expired")) {
                setError("Failed to connect to server. Please try again later.");
                toast({
                    title: "Connection Error",
                    description: "Failed to update user. Server may be unavailable.",
                    variant: "destructive",
                });
            }
            return null;
        } finally {
            setIsLoading(false);
        }
    }, [toast, refreshToken]);

    useEffect(() => {
        console.log("Initial users fetch...");
        fetchUsers(0, pageSize);
    }, [fetchUsers, pageSize]);

    return {
        users,
        isLoading,
        error,
        currentPage,
        totalPages,
        pageSize,
        setPageSize,
        fetchUsers,
        searchUsers,
        updateUser,
    };
}