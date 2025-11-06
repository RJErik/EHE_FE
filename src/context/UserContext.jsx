import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useUser as useUserHook } from '../hooks/useUser';

// Create the context
const UserContext = createContext(null);

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
    });

    // Force a re-render when users change
    const updateLastChange = useCallback(() => {
        setLastUpdate(Date.now());
    }, []);

    // Create a method to refresh using the last search parameters
    const refreshLatestSearch = useCallback(() => {
        console.log('[UserContext] Refreshing with last search:', lastSearchParamsRef.current);

        if (lastSearchParamsRef.current.requestType === 'search') {
            userData.searchUsers(
                lastSearchParamsRef.current.userId,
                lastSearchParamsRef.current.username,
                lastSearchParamsRef.current.email,
                lastSearchParamsRef.current.accountStatus,
                lastSearchParamsRef.current.registrationDateFromTime,
                lastSearchParamsRef.current.registrationDateToTime
            );
        } else {
            userData.fetchUsers();
        }
    }, [userData]);

    // Extended search function that stores the parameters
    const searchUsersWithMemory = useCallback((userId, username, email, accountStatus, registrationDateFromTime, registrationDateToTime) => {
        lastSearchParamsRef.current = {
            requestType: 'search',
            userId,
            username,
            email,
            accountStatus,
            registrationDateFromTime,
            registrationDateToTime,
        };
        return userData.searchUsers(userId, username, email, accountStatus, registrationDateFromTime, registrationDateToTime);
    }, [userData]);

    // Extended fetch function that stores it was a general fetch
    const fetchUsersWithMemory = useCallback(() => {
        lastSearchParamsRef.current = {
            requestType: 'fetchAll',
            userId: '',
            username: '',
            email: '',
            accountStatus: '',
            registrationDateFromTime: '',
            registrationDateToTime: '',
        };
        return userData.fetchUsers();
    }, [userData]);

    // Memoize the context value to prevent unnecessary renders
    const contextValue = {
        ...userData,
        lastUpdate,
        updateLastChange,
        searchUsers: searchUsersWithMemory,
        fetchUsers: fetchUsersWithMemory,
        refreshLatestSearch,
    };

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to use the user context
export function useUserContext() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}