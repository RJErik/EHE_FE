import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import { Card, CardContent, CardHeader } from "../../components/ui/card.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select.jsx";
import { Input } from "../../components/ui/input.jsx";
import { useTransaction } from "../../context/TransactionContext.jsx";
import { useStockData } from "../../hooks/useStockData.js";
import { Loader2, RefreshCw } from "lucide-react";

const SearchTransactions = () => {
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Search parameters
    const [userId, setUserId] = useState("_any_");
    const [portfolioId, setPortfolioId] = useState("_any_");  // ADD THIS
    const [searchPlatform, setSearchPlatform] = useState("_any_");
    const [searchSymbol, setSearchSymbol] = useState("_any_");
    const [fromTime, setFromTime] = useState("");
    const [toTime, setToTime] = useState("");
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

    const handleSearch = async () => {
        setIsSearching(true);
        setHasSearched(true);

        try {
            // If all fields are "any", fetch all items
            if (userId === "_any_" && portfolioId === "_any_" && searchPlatform === "_any_" && searchSymbol === "_any_" &&
                !fromTime && !toTime && !fromAmount && !toAmount && !fromPrice && !toPrice &&
                type === "_any_" && status === "_any_") {
                await fetchTransactions();
            } else {
                await searchTransactions(
                    userId,
                    portfolioId,  // ADD THIS
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
        setPortfolioId("_any_");  // ADD THIS
        setSearchPlatform("_any_");
        setSearchSymbol("_any_");
        setFromTime("");
        setToTime("");
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
                    {/* User ID */}
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

                    {/* Time Range */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <p className="text-xs mb-1">From Time</p>
                            <Input
                                type="datetime-local"
                                value={fromTime}
                                onChange={(e) => setFromTime(e.target.value)}
                                disabled={isSearching}
                            />
                        </div>
                        <div>
                            <p className="text-xs mb-1">To Time</p>
                            <Input
                                type="datetime-local"
                                value={toTime}
                                onChange={(e) => setToTime(e.target.value)}
                                disabled={isSearching}
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
                                <SelectItem value="Buy">Buy</SelectItem>
                                <SelectItem value="Sell">Sell</SelectItem>
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
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Completed">Completed</SelectItem>
                                <SelectItem value="Failed">Failed</SelectItem>
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