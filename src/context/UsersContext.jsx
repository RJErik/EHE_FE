import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useUsers as useUserHook } from '../hooks/useUsers.js';

// Create the context
const UsersContext = createContext(null);

// Provider component
export function UserProvider({ children }) {
    const userData = useUserHook();
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Use a ref for last search params to prevent unnecessary renders
    const lastSearchParamsRef = useRef({
        requestType: 'fetchAll',
        userId: '',
        username: '',
        email: '',
        accountStatus: '',
        registrationDateFromTime: '',
        registrationDateToTime: '',
        page: 0,
        size: 10
    });

    // Force a re-render when users change
    useEffect(() => {
        setLastUpdate(Date.now());
    }, [userData.users]);

    // Create a method to refresh using the last search parameters
    const refreshLatestSearch = useCallback(() => {
        console.log('[UsersContext] Refreshing with last search:', lastSearchParamsRef.current);

        if (lastSearchParamsRef.current.requestType === 'search') {
            userData.searchUsers(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.username,
                lastSearchParamsRef.current.email,
                lastSearchParamsRef.current.accountStatus,
                lastSearchParamsRef.current.registrationDateFromTime,
                lastSearchParamsRef.current.registrationDateToTime,
                lastSearchParamsRef.current.page,
                lastSearchParamsRef.current.size
            );
        } else {
            userData.fetchUsers(
                lastSearchParamsRef.current.page,
                lastSearchParamsRef.current.size
            );
        }
    }, [userData]);

    // Extended search function that stores the parameters and resets to page 0
    const searchUsersWithMemory = useCallback((userId, username, email, accountStatus, registrationDateFromTime, registrationDateToTime) => {
        lastSearchParamsRef.current = {
            requestType: 'search',
            userId,
            username,
            email,
            accountStatus,
            registrationDateFromTime,
            registrationDateToTime,
            page: 0,
            size: userData.pageSize
        };
        return userData.searchUsers(userId, username, email, accountStatus, registrationDateFromTime, registrationDateToTime, 0, userData.pageSize);
    }, [userData]);

    // Extended fetch function that stores it was a general fetch and resets to page 0
    const fetchUsersWithMemory = useCallback(() => {
        lastSearchParamsRef.current = {
            requestType: 'fetchAll',
            userId: '',
            username: '',
            email: '',
            accountStatus: '',
            registrationDateFromTime: '',
            registrationDateToTime: '',
            page: 0,
            size: userData.pageSize
        };
        return userData.fetchUsers(0, userData.pageSize);
    }, [userData]);

    // Navigate to a specific page (0-based internally)
    const goToPage = useCallback((page) => {
        const validPage = Math.max(0, Math.min(page, userData.totalPages - 1));

        lastSearchParamsRef.current.page = validPage;

        if (lastSearchParamsRef.current.requestType === 'search') {
            userData.searchUsers(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.username,
                lastSearchParamsRef.current.email,
                lastSearchParamsRef.current.accountStatus,
                lastSearchParamsRef.current.registrationDateFromTime,
                lastSearchParamsRef.current.registrationDateToTime,
                validPage,
                userData.pageSize
            );
        } else {
            userData.fetchUsers(validPage, userData.pageSize);
        }
    }, [userData]);

    // Change page size and calculate which page to show
    const changePageSize = useCallback((newSize) => {
        const currentFirstItemIndex = userData.currentPage * userData.pageSize;
        const newPage = Math.floor(currentFirstItemIndex / newSize);
        const validPage = Math.max(0, newPage);

        userData.setPageSize(newSize);
        lastSearchParamsRef.current.size = newSize;
        lastSearchParamsRef.current.page = validPage;

        if (lastSearchParamsRef.current.requestType === 'search') {
            userData.searchUsers(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.username,
                lastSearchParamsRef.current.email,
                lastSearchParamsRef.current.accountStatus,
                lastSearchParamsRef.current.registrationDateFromTime,
                lastSearchParamsRef.current.registrationDateToTime,
                validPage,
                newSize
            );
        } else {
            userData.fetchUsers(validPage, newSize);
        }
    }, [userData]);

    // Memoize the context value to prevent unnecessary renders
    const contextValue = {
        ...userData,
        lastUpdate,
        searchUsers: searchUsersWithMemory,
        fetchUsers: fetchUsersWithMemory,
        refreshLatestSearch,
        goToPage,
        changePageSize
    };

    return (
        <UsersContext.Provider value={contextValue}>
            {children}
        </UsersContext.Provider>
    );
}

// Custom hook to use the user context
export function useUserContext() {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}