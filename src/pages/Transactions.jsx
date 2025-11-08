import SearchTransactions from "../feature/transaction/SearchTransactions.jsx";
import TransactionsList from "../feature/transaction/TransactionList.jsx";
import { TransactionProvider } from "../context/TransactionsContext.jsx";

const Transactions = () => {
    return (
        <TransactionProvider>
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 p-4">
                    <h1 className="text-4xl font-semibold text-center mb-8">Transactions</h1>

                    <div className="container mx-auto">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left section - Search and Settings */}
                            <div className="w-full lg:w-1/4">
                                <SearchTransactions />
                            </div>

                            {/* Right section - List of transactions */}
                            <div className="w-full lg:w-3/4">
                                <TransactionsList />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </TransactionProvider>
    );
};

export default Transactions;