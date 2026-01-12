import { Card, CardContent } from "../../components/ui/card.jsx";
import { useUserContext } from "../../context/UsersContext.jsx";
import { Loader2 } from "lucide-react";
import UserItemCard from "./UserItemCard.jsx";
import UpdateUserDialog from "./UpdateUserDialog.jsx";
import { useState } from "react";
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

const UserList = () => {
    const {
        users,
        isLoading,
        error,
        lastUpdate,
        currentPage,
        totalPages,
        pageSize,
        goToPage,
        changePageSize
    } = useUserContext();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    // Generate page numbers to display (1-based for UI)
    const getPageNumbers = () => {
        const pages = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const currentDisplayPage = currentPage + 1;

            pages.push(1);

            let startPage = Math.max(2, currentDisplayPage - 1);
            let endPage = Math.min(totalPages - 1, currentDisplayPage + 1);

            if (currentDisplayPage <= 3) {
                endPage = 4;
            }

            if (currentDisplayPage >= totalPages - 2) {
                startPage = totalPages - 3;
            }

            if (startPage > 2) {
                pages.push('ellipsis-start');
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (endPage < totalPages - 1) {
                pages.push('ellipsis-end');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const handlePageChange = (displayPage) => {
        const internalPage = displayPage - 1;
        if (internalPage >= 0 && internalPage < totalPages && internalPage !== currentPage) {
            goToPage(internalPage);
        }
    };

    const handlePageSizeChange = (newSize) => {
        changePageSize(parseInt(newSize));
    };

    return (
        <>
            <Card className="w-full h-full">
                <CardContent className="p-6 h-full min-h-[600px] flex flex-col">
                    {isLoading ? (
                        <div className="flex justify-center items-center flex-1">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center flex-1 flex-col">
                            <p className="text-lg text-destructive">Error loading users</p>
                            <p className="text-sm text-muted-foreground mt-2">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex justify-center items-center flex-1">
                            <p className="text-lg text-muted-foreground">No users found</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-xs text-muted-foreground">
                                        Showing {users.length} user{users.length !== 1 ? 's' : ''}
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
                                    {users.map((user) => (
                                        <UserItemCard
                                            key={`user-${user.user_id}-${lastUpdate}`}
                                            user={user}
                                            onEditClick={handleEditClick}
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
                                                    onClick={() => handlePageChange(currentPage)}
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
                                                            isActive={currentPage === page - 1}
                                                            className="cursor-pointer"
                                                        >
                                                            {page}
                                                        </PaginationLink>
                                                    )}
                                                </PaginationItem>
                                            ))}

                                            <PaginationItem>
                                                <PaginationNext
                                                    onClick={() => handlePageChange(currentPage + 2)}
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

            {/* Edit Users Dialog */}
            <UpdateUserDialog
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                user={selectedUser}
            />
        </>
    );
};

export default UserList;