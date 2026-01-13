import SearchUsers from "../feature/user/SearchUsers.jsx";
import UserList from "../feature/user/UserList.jsx";
import { UserProvider, useUserContext } from "../context/UsersContext.jsx";
import { useEffect } from "react";

const UsersContent = () => {
    const { fetchUsers } = useUserContext();

    useEffect(() => {
        console.log("Initial users fetch...");
        fetchUsers();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1 p-4">
                <h1 className="text-4xl font-semibold text-center mb-8">Users</h1>

                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left section - Search and Settings */}
                        <div className="w-full lg:w-1/4">
                            <SearchUsers />
                        </div>

                        {/* Right section - List of users */}
                        <div className="w-full lg:w-3/4">
                            <UserList />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const Users = () => {
    return (
        <UserProvider>
            <UsersContent />
        </UserProvider>
    );
};

export default Users;