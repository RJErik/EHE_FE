import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx";
import { Input } from "../../components/ui/input.jsx";
import { Calendar } from "../../components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover.jsx";
import { useTransaction } from "../../context/TransactionsContext.jsx";
import { useStockData } from "../../hooks/useStockData.js";
import { Loader2, RefreshCw, ChevronDownIcon } from "lucide-react";

const SearchTransactions = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [, setHasSearched] = useState(false);

    // Search parameters
    const [userId, setUserId] = useState("_any_");
    const [portfolioId, setPortfolioId] = useState("_any_");
    const [searchPlatform, setSearchPlatform] = useState("_any_");
    const [searchSymbol, setSearchSymbol] = useState("_any_");

    // Date picker states - From
    const [fromDate, setFromDate] = useState(undefined);
    const [fromTimeValue, setFromTimeValue] = useState("");
    const [fromDateOpen, setFromDateOpen] = useState(false);

    // Date picker states - To
    const [toDate, setToDate] = useState(undefined);
    const [toTimeValue, setToTimeValue] = useState("");
    const [toDateOpen, setToDateOpen] = useState(false);

    const [fromAmount, setFromAmount] = useState("");
    const [toAmount, setToAmount] = useState("");
    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");
    const [type, setType] = useState("_any_");
    const [status, setStatus] = useState("_any_");

    const {
        platforms,
        stocks,
        isLoadingPlatforms,
        isLoadingStocks
    } = useStockData();

    const { searchTransactions, fetchTransactions, refreshInterval, updateRefreshInterval } = useTransaction();

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
        const fromTime = combineDateTimeToString(fromDate, fromTimeValue);
        const toTime = combineDateTimeToString(toDate, toTimeValue);

        try {
            // If all fields are "any", fetch all items
            if (userId === "_any_" && portfolioId === "_any_" && searchPlatform === "_any_" && searchSymbol === "_any_" &&
                !fromTime && !toTime && !fromAmount && !toAmount && !fromPrice && !toPrice &&
                type === "_any_" && status === "_any_") {
                await fetchTransactions();
            } else {
                await searchTransactions(
                    userId,
                    portfolioId,
                    searchPlatform,
                    searchSymbol,
                    fromTime,
                    toTime,
                    fromAmount,
                    toAmount,
                    fromPrice,
                    toPrice,
                    type,
                    status
                );
            }
        } finally {
            setIsSearching(false);
        }
    };

    const handleClear = () => {
        setUserId("_any_");
        setPortfolioId("_any_");
        setSearchPlatform("_any_");
        setSearchSymbol("_any_");
        setFromDate(undefined);
        setFromTimeValue("");
        setToDate(undefined);
        setToTimeValue("");
        setFromAmount("");
        setToAmount("");
        setFromPrice("");
        setToPrice("");
        setType("_any_");
        setStatus("_any_");
        setHasSearched(false);
        fetchTransactions();
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
                            type="text"
                            placeholder="Enter user ID"
                            value={userId === "_any_" ? "" : userId}
                            onChange={(e) => setUserId(e.target.value || "_any_")}
                            disabled={isSearching}
                        />
                    </div>

                    {/* Portfolio ID */}
                    <div>
                        <p className="text-xs mb-1">Portfolio ID</p>
                        <Input
                            type="text"
                            placeholder="Enter portfolio ID"
                            value={portfolioId === "_any_" ? "" : portfolioId}
                            onChange={(e) => setPortfolioId(e.target.value || "_any_")}
                            disabled={isSearching}
                        />
                    </div>

                    {/* Platform */}
                    <div>
                        <p className="text-xs mb-1">Platform</p>
                        <Select
                            value={searchPlatform}
                            onValueChange={setSearchPlatform}
                            disabled={isLoadingPlatforms || isSearching}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select platform" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_any_">Any platform</SelectItem>
                                {platforms.map((platform) => (
                                    <SelectItem key={platform} value={platform}>{platform}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Stock */}
                    <div>
                        <p className="text-xs mb-1">Stock Symbol</p>
                        <Select
                            value={searchSymbol}
                            onValueChange={setSearchSymbol}
                            disabled={isLoadingStocks || isSearching}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select stock" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_any_">Any stock</SelectItem>
                                {stocks.map((stock) => (
                                    <SelectItem key={stock} value={stock}>{stock}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Time Range - From */}
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
                                value={fromTimeValue}
                                onChange={(e) => setFromTimeValue(e.target.value)}
                                disabled={isSearching}
                                className="bg-background"
                            />
                        </div>
                    </div>

                    {/* Time Range - To */}
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
                                value={toTimeValue}
                                onChange={(e) => setToTimeValue(e.target.value)}
                                disabled={isSearching}
                                className="bg-background"
                            />
                        </div>
                    </div>

                    {/* Amount Range */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs mb-1">From Amount</p>
                            <Input
                                type="number"
                                placeholder="Min amount"
                                value={fromAmount}
                                onChange={(e) => setFromAmount(e.target.value)}
                                disabled={isSearching}
                            />
                        </div>
                        <div>
                            <p className="text-xs mb-1">To Amount</p>
                            <Input
                                type="number"
                                placeholder="Max amount"
                                value={toAmount}
                                onChange={(e) => setToAmount(e.target.value)}
                                disabled={isSearching}
                            />
                        </div>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs mb-1">From Price</p>
                            <Input
                                type="number"
                                placeholder="Min price"
                                value={fromPrice}
                                onChange={(e) => setFromPrice(e.target.value)}
                                disabled={isSearching}
                                step="0.01"
                            />
                        </div>
                        <div>
                            <p className="text-xs mb-1">To Price</p>
                            <Input
                                type="number"
                                placeholder="Max price"
                                value={toPrice}
                                onChange={(e) => setToPrice(e.target.value)}
                                disabled={isSearching}
                                step="0.01"
                            />
                        </div>
                    </div>

                    {/* Type */}
                    <div>
                        <p className="text-xs mb-1">Transaction Type</p>
                        <Select value={type} onValueChange={setType} disabled={isSearching}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_any_">Any type</SelectItem>
                                <SelectItem value="BUY">Buy</SelectItem>
                                <SelectItem value="SELL">Sell</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status */}
                    <div>
                        <p className="text-xs mb-1">Status</p>
                        <Select value={status} onValueChange={setStatus} disabled={isSearching}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="_any_">Any status</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="COMPLETED">Completed</SelectItem>
                                <SelectItem value="FAILED">Failed</SelectItem>
                            </SelectContent>
                        </Select>
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

            {/* Auto-Refresh Settings Card */}
            <Card className="w-full">
                <CardHeader className="text-center pb-2">
                    <h3 className="text-lg">Auto-Refresh</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div>
                        <p className="text-xs mb-2">Refresh Interval</p>
                        <Select value={refreshInterval} onValueChange={updateRefreshInterval} disabled={isSearching}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select refresh interval" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="off">Off</SelectItem>
                                <SelectItem value="30s">30 seconds</SelectItem>
                                <SelectItem value="1m">1 minute</SelectItem>
                                <SelectItem value="5m">5 minutes</SelectItem>
                                <SelectItem value="15m">15 minutes</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {refreshInterval === 'off'
                            ? 'Auto-refresh is disabled'
                            : `Results will refresh automatically every ${refreshInterval}`}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SearchTransactions;