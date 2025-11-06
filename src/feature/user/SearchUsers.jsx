import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx";
import { Input } from "../../components/ui/input.jsx";
import { useUserContext } from "../../context/UserContext.jsx";
import { Loader2, RefreshCw } from "lucide-react";

const SearchUsers = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Search parameters
    const [userId, setUserId] = useState("_any_");
    const [username, setUsername] = useState("_any_");
    const [email, setEmail] = useState("_any_");
    const [accountStatus, setAccountStatus] = useState("_any_");
    const [registrationDateFromTime, setRegistrationDateFromTime] = useState("");
    const [registrationDateToTime, setRegistrationDateToTime] = useState("");

    const { searchUsers, fetchUsers } = useUserContext();

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);

        try {
            // If all fields are "any", fetch all items
            if (userId === "_any_" && username === "_any_" && email === "_any_" && accountStatus === "_any_" &&
                !registrationDateFromTime && !registrationDateToTime) {
                await fetchUsers();
            } else {
                await searchUsers(
                    userId,
                    username,
                    email,
                    accountStatus,
                    registrationDateFromTime,
                    registrationDateToTime
                );
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setUserId("_any_");
        setUsername("_any_");
        setEmail("_any_");
        setAccountStatus("_any_");
        setRegistrationDateFromTime("");
        setRegistrationDateToTime("");
        setHasSearched(false);
        fetchUsers();
    };

    const handleRefresh = () => {
        handleSearch();
    };

    return (
        <div className="space-y-4">
            {/* Search Card */}
            <Card className="w-full">
                <CardHeader className="text-center pb-2">
                    <h3 className="text-lg">Search Filters</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* User ID */}
                    <div>
                        <p className="text-xs mb-1">User ID</p>
                        <Input
                            type="number"
                            placeholder="Enter user ID"
                            value={userId === "_any_" ? "" : userId}
                            onChange={(e) => setUserId(e.target.value || "_any_")}
                            disabled={isSearching}
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <p className="text-xs mb-1">Username</p>
                        <Input
                            type="text"
                            placeholder="Enter username"
                            value={username === "_any_" ? "" : username}
                            onChange={(e) => setUsername(e.target.value || "_any_")}
                            disabled={isSearching}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <p className="text-xs mb-1">Email</p>
                        <Input
                            type="email"
                            placeholder="Enter email"
                            value={email === "_any_" ? "" : email}
                            onChange={(e) => setEmail(e.target.value || "_any_")}
                            disabled={isSearching}
                        />
                    </div>

                    {/* Account Status */}
                    <div>
                        <p className="text-xs mb-1">Account Status</p>
                        <Select
                            value={accountStatus}
                            onValueChange={setAccountStatus}
                            disabled={isSearching}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_any_">Any status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                <SelectItem value="NONVERIFIED">Non-verified</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Registration Date Range */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs mb-1">From Registration Date</p>
                            <Input
                                type="datetime-local"
                                value={registrationDateFromTime}
                                onChange={(e) => setRegistrationDateFromTime(e.target.value)}
                                disabled={isSearching}
                            />
                        </div>
                        <div>
                            <p className="text-xs mb-1">To Registration Date</p>
                            <Input
                                type="datetime-local"
                                value={registrationDateToTime}
                                onChange={(e) => setRegistrationDateToTime(e.target.value)}
                                disabled={isSearching}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col space-y-2">
                        <div className="flex space-x-2">
                            <Button
                                className="flex-1"
                                onClick={handleSearch}
                                disabled={isSearching}
                            >
                                {isSearching ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Searching...
                                    </>
                                ) : (
                                    "Search"
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleClear}
                                disabled={isSearching}
                            >
                                Clear
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleRefresh}
                                disabled={isSearching}
                                title="Refresh results"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchUsers;