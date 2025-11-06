import SearchUsers from "../feature/user/SearchUsers.jsx";
import UsersList from "../feature/user/UsersList.jsx";
import { UserProvider } from "../context/UserContext.jsx";

const User = () => {
    return (
        <UserProvider>
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
                                <UsersList />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </UserProvider>
    );
};

export default User;