import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../../components/ui/dialog.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Input } from "../../components/ui/input.jsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select.jsx";
import { useUserContext } from "../../context/UsersContext.jsx";
import { Loader2 } from "lucide-react";

const UpdateUserDialog = ({ open, onOpenChange, user }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [accountStatus, setAccountStatus] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const { updateUser, isLoading } = useUserContext();

    // Populate form when user changes
    useEffect(() => {
        if (user) {
            setUsername(user.user_name || "");
            setEmail(user.email || "");
            setPassword("");
            setAccountStatus(user.account_status || "");
        }
    }, [user, open]);

    const handleSave = async () => {
        if (!user) return;

        setIsUpdating(true);
        try {
            // Only send fields that have changed or are not empty
            const result = await updateUser(
                user.user_id,
                username !== user.user_name ? username : "",
                email !== user.email ? email : "",
                password || "",
                accountStatus !== user.account_status ? accountStatus : ""
            );

            if (result) {
                onOpenChange(false);
            }
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCancel = () => {
        onOpenChange(false);
    };

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                    <DialogDescription>
                        Update user information. Leave fields empty to keep existing values.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Users ID - Read only */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">User ID</label>
                        <Input
                            type="number"
                            value={user.user_id}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Username</label>
                        <Input
                            type="text"
                            placeholder="Leave empty to keep existing"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={isUpdating || isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Current: {user.user_name}
                        </p>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            placeholder="Leave empty to keep existing"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isUpdating || isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Current: {user.email}
                        </p>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Password</label>
                        <Input
                            type="password"
                            placeholder="Leave empty to keep existing"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isUpdating || isLoading}
                        />
                        <p className="text-xs text-muted-foreground">
                            Only fill if you want to change the password
                        </p>
                    </div>

                    {/* Account Status */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Account Status</label>
                        <Select
                            value={accountStatus}
                            onValueChange={setAccountStatus}
                            disabled={isUpdating || isLoading}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">Keep existing</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                <SelectItem value="NONVERIFIED">Non-verified</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Current: {user.account_status}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isUpdating || isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isUpdating || isLoading}
                    >
                        {isUpdating || isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            "Save Changes"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateUserDialog;