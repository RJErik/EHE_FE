import { Card, CardContent } from "../../components/ui/card.jsx";
import { Button } from "../../components/ui/button.jsx";
import { Trash2, TrendingUp, TrendingDown } from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";
import { cn } from "@/lib/utils.js";

const TransactionItemCard = ({ transaction, onRemove }) => {
    const isBuy = transaction.transaction_type === "Buy";
    const isCompleted = transaction.status === "Completed";
    const isPending = transaction.status === "Pending";
    const isFailed = transaction.status === "Failed";

    const formatPrice = (price) => {
        return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
    };

    const formatAmount = (amount) => {
        return typeof amount === 'number' ? amount.toFixed(4) : amount;
    };

    const formatTime = (time) => {
        if (!time) return '-';
        const date = new Date(time);
        return date.toLocaleString();
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                            User: {transaction.user_id}
                        </span>
                        <Separator className="h-4 w-px" orientation="vertical" />
                        <span className="text-sm font-medium">{transaction.platform}</span>
                        <Separator className="h-4 w-px" orientation="vertical" />
                        <span className="text-sm font-bold text-blue-600">{transaction.symbol}</span>
                    </div>
                    {onRemove && (
                        <Button variant="outline" size="icon" onClick={() => onRemove(transaction.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Type</p>
                        <div className={cn(
                            "flex items-center font-semibold",
                            isBuy ? "text-green-600" : "text-red-600"
                        )}>
                            {isBuy ? (
                                <>
                                    <TrendingUp className="h-4 w-4 mr-1" />
                                    Buy
                                </>
                            ) : (
                                <>
                                    <TrendingDown className="h-4 w-4 mr-1" />
                                    Sell
                                </>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Status</p>
                        <p className={cn(
                            "font-semibold",
                            isCompleted ? "text-green-600" : isPending ? "text-yellow-600" : "text-red-600"
                        )}>
                            {transaction.status}
                        </p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-semibold">{formatAmount(transaction.amount)}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">{formatPrice(transaction.price)}</p>
                    </div>

                    <div className="md:col-span-4 space-y-1">
                        <p className="text-xs text-muted-foreground">Transaction Time</p>
                        <p className="font-mono text-xs">{formatTime(transaction.transaction_time)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionItemCard;