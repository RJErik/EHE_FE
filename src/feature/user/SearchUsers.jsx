import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Calendar } from "../../components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover.jsx";
import { useUserContext } from "../../context/UsersContext.jsx";
import { Loader2, RefreshCw, ChevronDownIcon } from "lucide-react";

const SearchUsers = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [, setHasSearched] = useState(false);

    // Search parameters
    const [userId, setUserId] = useState("_any_");
    const [username, setUsername] = useState("_any_");
    const [email, setEmail] = useState("_any_");
    const [accountStatus, setAccountStatus] = useState("_any_");

    // Date picker states - From
    const [fromDate, setFromDate] = useState(undefined);
    const [fromTime, setFromTime] = useState("");
    const [fromDateOpen, setFromDateOpen] = useState(false);

    // Date picker states - To
    const [toDate, setToDate] = useState(undefined);
    const [toTime, setToTime] = useState("");
    const [toDateOpen, setToDateOpen] = useState(false);

    const { searchUsers, fetchUsers } = useUserContext();

    // Helper function to combine date and time into datetime string
    const combineDateTimeToString = (date, time) => {
        if (!date) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // If time is provided, combine; otherwise use start/end of day
        if (time) {
            return `${dateStr}T${time}`;
        }
        return `${dateStr}T00:00`;
    };

    // Format date for display
    const formatDateDisplay = (date) => {
        if (!date) return "Select date";
        return date.toLocaleDateString();
    };

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);

        // Combine date and time into datetime strings
        const registrationDateFromTime = combineDateTimeToString(fromDate, fromTime);
        const registrationDateToTime = combineDateTimeToString(toDate, toTime);

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
        setFromDate(undefined);
        setFromTime("");
        setToDate(undefined);
        setToTime("");
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
                    {/* Users ID */}
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

                    {/* Registration Date Range - From */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs mb-1">From Date</p>
                            <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between font-normal"
                                        disabled={isSearching}
                                    >
                                        {formatDateDisplay(fromDate)}
                                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={fromDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setFromDate(date);
                                            setFromDateOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <p className="text-xs mb-1">From Time</p>
                            <Input
                                type="time"
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
                                disabled={isSearching}
                                className="bg-background"
                            />
                        </div>
                    </div>

                    {/* Registration Date Range - To */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs mb-1">To Date</p>
                            <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="w-full justify-between font-normal"
                                        disabled={isSearching}
                                    >
                                        {formatDateDisplay(toDate)}
                                        <ChevronDownIcon className="h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={toDate}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setToDate(date);
                                            setToDateOpen(false);
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div>
                            <p className="text-xs mb-1">To Time</p>
                            <Input
                                type="time"
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
                                disabled={isSearching}
                                className="bg-background"
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