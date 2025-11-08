import { Card, CardContent } from "../../components/ui/card.jsx";
import { useTransaction } from "../../context/TransactionsContext.jsx";
import { Loader2 } from "lucide-react";
import TransactionItemCard from "./TransactionItemCard.jsx";
import { useEffect, useRef } from "react";

const TransactionsList = () => {
    const { transactions, isLoading, error, lastUpdate } = useTransaction();
    const initialFetchDoneRef = useRef(false);

    // Initial fetch is handled by the hook
    useEffect(() => {
        console.log("TransactionsList mounted");
    }, []);

    return (
        <Card className="w-full h-full">
            <CardContent className="p-6 h-full min-h-[600px]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex justify-center items-center h-full flex-col">
                        <p className="text-lg text-destructive">Error loading transactions</p>
                        <p className="text-sm text-muted-foreground mt-2">{error}</p>
                    </div>
                ) : transactions.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <p className="text-lg text-muted-foreground">No transactions found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">
                            Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                        </p>
                        {transactions.map((transaction) => (
                            <TransactionItemCard
                                key={`transaction-${transaction.id}-${lastUpdate}`}
                                transaction={transaction}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default TransactionsList;