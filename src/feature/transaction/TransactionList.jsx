import { Card, CardContent } from "../../components/ui/card.jsx";
import { useTransaction } from "../../context/TransactionsContext.jsx";
import { Loader2 } from "lucide-react";
import TransactionItemCard from "./TransactionItemCard.jsx";
import { useEffect } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const TransactionsList = () => {
    const {
        transactions,
        isLoading,
        error,
        lastUpdate,
        currentPage, // 0-based internally
        totalPages,
        pageSize,
        goToPage,
        changePageSize
    } = useTransaction();

    useEffect(() => {
        console.log("TransactionsList mounted");
    }, []);

    // Generate page numbers to display (1-based for UI)
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total is small
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const currentDisplayPage = currentPage + 1; // Convert to 1-based for display

            // Always show first page
            pages.push(1);

            let startPage = Math.max(2, currentDisplayPage - 1);
            let endPage = Math.min(totalPages - 1, currentDisplayPage + 1);

            // Adjust if we're near the beginning
            if (currentDisplayPage <= 3) {
                endPage = 4;
            }

            // Adjust if we're near the end
            if (currentDisplayPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push('ellipsis-start');
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push('ellipsis-end');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageChange = (displayPage) => {
        // Convert from 1-based display to 0-based internal
        const internalPage = displayPage - 1;
        if (internalPage >= 0 && internalPage < totalPages && internalPage !== currentPage) {
            goToPage(internalPage);
        }
    };

    const handlePageSizeChange = (newSize) => {
        changePageSize(parseInt(newSize));
    };

    return (
        <Card className="w-full h-full">
            <CardContent className="p-6 h-full min-h-[600px] flex flex-col">
                {isLoading ? (
                    <div className="flex justify-center items-center flex-1">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center flex-1 flex-col">
                        <p className="text-lg text-destructive">Error loading transactions</p>
                        <p className="text-sm text-muted-foreground mt-2">{error}</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex justify-center items-center flex-1">
                        <p className="text-lg text-muted-foreground">No transactions found</p>
                    </div>
                ) : (
                    <>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-xs text-muted-foreground">
                                    Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                                    {' '}(Page {currentPage + 1} of {totalPages})
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">Items per page:</span>
                                    <Select
                                        value={pageSize.toString()}
                                        onValueChange={handlePageSizeChange}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-[100px] h-8">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="10">10</SelectItem>
                                            <SelectItem value="25">25</SelectItem>
                                            <SelectItem value="50">50</SelectItem>
                                            <SelectItem value="100">100</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {transactions.map((transaction) => (
                                    <TransactionItemCard
                                        key={`transaction-${transaction.transactionId}-${lastUpdate}`}
                                        transaction={transaction}
                                    />
                                ))}
                            </div>
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage)} // currentPage is 0-based, so currentPage displays as current-1
                                                className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {getPageNumbers().map((page, index) => (
                                            <PaginationItem key={index}>
                                                {page === 'ellipsis-start' || page === 'ellipsis-end' ? (
                                                    <PaginationEllipsis />
                                                ) : (
                                                    <PaginationLink
                                                        onClick={() => handlePageChange(page)}
                                                        isActive={currentPage === page - 1} // page is 1-based, currentPage is 0-based
                                                        className="cursor-pointer"
                                                    >
                                                        {page}
                                                    </PaginationLink>
                                                )}
                                            </PaginationItem>
                                        ))}

                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 2)} // currentPage+2 because currentPage is 0-based
                                                className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default TransactionsList;