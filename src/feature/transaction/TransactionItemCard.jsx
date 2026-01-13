import { Card, CardContent } from "../../components/ui/card.jsx";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Separator } from "@/components/ui/separator.jsx";
import { cn } from "@/lib/utils.js";
import binanceLogo from "../../assets/binance.png";
import alpacaLogo from "../../assets/alpaca.png";
import defaultPlatformLogo from "../../assets/default-platform.png";

const TransactionItemCard = ({ transaction }) => {
    const isBuy = transaction.type === "BUY";
    const isCompleted = transaction.status === "COMPLETED";
    const isPending = transaction.status === "PENDING";
    const isFailed = transaction.status === "FAILED";

    const formatPrice = (price) => {
        return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
    };

    const formatQuantity = (quantity) => {
        return typeof quantity === 'number' ? quantity.toFixed(4) : quantity;
    };

    const formatTime = (time) => {
        if (!time) return '-';
        const date = new Date(time);
        return date.toLocaleString();
    };

    // Determine which logo to use based on platform
    const getLogo = (platformName) => {
        if (!platformName) return defaultPlatformLogo;

        const platformLower = platformName.toLowerCase();

        switch (platformLower) {
            case 'binance':
                return binanceLogo;
            case 'alpaca':
                return alpacaLogo;
            default:
                return defaultPlatformLogo;
        }
    };

    return (
        <Card className="w-full">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 flex-wrap">
                        <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                            User: {transaction.userId}
                        </span>
                        <Separator className="h-4 w-px" orientation="vertical" />
                        <span className="text-xs font-semibold bg-muted px-2 py-1 rounded">
                            Portfolio: {transaction.portfolioId}
                        </span>
                        <Separator className="h-4 w-px" orientation="vertical" />
                        <div className="flex items-center space-x-2">
                            <img
                                src={getLogo(transaction.platform)}
                                alt={`${transaction.platform || 'Default'} logo`}
                                className="h-6 w-6 object-contain"
                            />
                            <span className="text-sm font-medium">{transaction.platform}</span>
                        </div>
                        <Separator className="h-4 w-px" orientation="vertical" />
                        <span className="text-sm font-bold">{transaction.symbol}</span>
                    </div>
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
                                    <ArrowUp className="h-4 w-4 mr-1" />
                                    Buy
                                </>
                            ) : (
                                <>
                                    <ArrowDown className="h-4 w-4 mr-1" />
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
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="font-semibold">{formatQuantity(transaction.quantity)}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold">{formatPrice(transaction.price)}</p>
                    </div>

                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Total Value</p>
                        <p className="font-semibold">{formatPrice(transaction.totalValue)}</p>
                    </div>

                    <div className="md:col-span-3 space-y-1">
                        <p className="text-xs text-muted-foreground">Transaction Date</p>
                        <p className="font-mono text-xs">{formatTime(transaction.transactionDate)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionItemCard;