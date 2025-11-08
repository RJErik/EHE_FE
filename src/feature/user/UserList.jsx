import { Card, CardContent } from "../../components/ui/card.jsx";
import { useUserContext } from "../../context/UsersContext.jsx";
import { Loader2 } from "lucide-react";
import UserItemCard from "./UserItemCard.jsx";
import UpdateUserDialog from "./UpdateUserDialog.jsx";
import { useState } from "react";

const UserList = () => {
    const { users, isLoading, error, lastUpdate } = useUserContext();
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditDialogOpen(true);
    };

    return (
        <>
            <Card className="w-full h-full">
                <CardContent className="p-6 h-full min-h-[600px]">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex justify-center items-center h-full flex-col">
                            <p className="text-lg text-destructive">Error loading users</p>
                            <p className="text-sm text-muted-foreground mt-2">{error}</p>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="flex justify-center items-center h-full">
                            <p className="text-lg text-muted-foreground">No users found</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs text-muted-foreground">
                                Showing {users.length} user{users.length !== 1 ? 's' : ''}
                            </p>
                            {users.map((user) => (
                                <UserItemCard
                                    key={`user-${user.user_id}-${lastUpdate}`}
                                    user={user}
                                    onEditClick={handleEditClick}
                                />
                            ))}
                        </div>
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