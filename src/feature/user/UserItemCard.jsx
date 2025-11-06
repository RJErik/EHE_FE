import { Card, CardContent } from "../../components/ui/card.jsx";
import { Pencil } from "lucide-react";
import { Button } from "../../components/ui/button.jsx";
import { cn } from "@/lib/utils.js";

const UserItemCard = ({ user, onEditClick }) => {
    const isActive = user.account_status === "ACTIVE";
    const isSuspended = user.account_status === "SUSPENDED";
    const isNonverified = user.account_status === "NONVERIFIED";

    const formatDate = (date) => {
        if (!date) return '-';
        const dateObj = new Date(date);
        return dateObj.toLocaleString();
    };

    const getStatusColor = () => {
        if (isActive) return "text-green-600";
        if (isSuspended) return "text-red-600";
        if (isNonverified) return "text-yellow-600";
        return "text-gray-600";
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-2 flex-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                            <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                                ID: {user.user_id}
                            </span>
                            <span className="text-sm font-bold text-blue-600">{user.user_name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={() => onEditClick(user)}
                        title="Edit user"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className={cn("font-semibold", getStatusColor())}>
                            {user.account_status}
                        </p>
                    </div>

                    <div className="space-y-1 md:col-span-2">
                        <p className="text-xs text-muted-foreground">Registered</p>
                        <p className="font-mono text-xs">{formatDate(user.registration_date)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default UserItemCard;