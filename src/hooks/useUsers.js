import { useState, useEffect, useCallback } from "react";
import { useToast } from "./use-toast";
import { useJwtRefresh } from "./useJwtRefresh";

export function useUsers() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { toast } = useToast();
    const { refreshToken } = useJwtRefresh();

    // Fetch all users
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            console.log("Fetching users...");
            let response = await fetch("http://localhost:8080/api/admin/users", {
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
                    throw new Error("Session expired. Please login again.");
                }

                // Retry the original request
                response = await fetch("http://localhost:8080/api/admin/users", {
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
                setUsers(data.users || []);
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
    }, [toast, refreshToken]);

    // Search users
    const searchUsers = useCallback(async (userId, username, email, accountStatus, registrationDateFromTime, registrationDateToTime) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Searching users: userId=${userId} username=${username} email=${email} accountStatus=${accountStatus} from=${registrationDateFromTime} to=${registrationDateToTime}`);

            let response = await fetch("http://localhost:8080/api/admin/users/search", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId === "_any_" ? "" : userId,
                    username: username === "_any_" ? "" : username,
                    email: email === "_any_" ? "" : email,
                    accountStatus: accountStatus === "_any_" ? "" : accountStatus,
                    registrationDateFromTime: registrationDateFromTime === "_any_" ? "" : registrationDateFromTime,
                    registrationDateToTime: registrationDateToTime === "_any_" ? "" : registrationDateToTime,
                }),
            });

            // Handle 401 - Token expired
            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    throw new Error("Session expired. Please login again.");
                }

                // Retry the original request
                response = await fetch("http://localhost:8080/api/admin/users/search", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: userId === "_any_" ? "" : userId,
                        username: username === "_any_" ? "" : username,
                        email: email === "_any_" ? "" : email,
                        accountStatus: accountStatus === "_any_" ? "" : accountStatus,
                        registrationDateFromTime: registrationDateFromTime === "_any_" ? "" : registrationDateFromTime,
                        registrationDateToTime: registrationDateToTime === "_any_" ? "" : registrationDateToTime,
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
                setUsers(data.users || []);
                return data.users || [];
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
    }, [toast, refreshToken]);

    // Update user
    const updateUser = useCallback(async (userId, username, email, password, accountStatus) => {
        setIsLoading(true);
        setError(null);

        try {
            console.log(`Updating user: userId=${userId}`);

            let response = await fetch("http://localhost:8080/api/admin/users/update", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    username: username || null,
                    email: email || null,
                    password: password || null,
                    accountStatus: accountStatus || null,
                }),
            });

            // Handle 401 - Token expired
            if (response.status === 401) {
                try {
                    await refreshToken();
                } catch (refreshError) {
                    throw new Error("Session expired. Please login again.");
                }

                // Retry the original request
                response = await fetch("http://localhost:8080/api/admin/users/update", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId,
                        username: username || null,
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
                // Refetch users to get updated data
                await fetchUsers();
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
    }, [toast, refreshToken, fetchUsers]);

    // Initial fetch
    useEffect(() => {
        console.log("Initial users fetch...");
        fetchUsers();
    }, [fetchUsers]);

    return {
        users,
        isLoading,
        error,
        fetchUsers,
        searchUsers,
        updateUser,
    };
}