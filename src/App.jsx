// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "./components/ui/toaster";
import Header from "./feature/Header.jsx";
import { AutomaticTradeProvider } from "@/context/AutomaticTradeContext.jsx";
import Transaction from "@/pages/Transaction.jsx";
import {TransactionProvider} from "@/context/TransactionContext.jsx";

function App() {
    return (
        <BrowserRouter>
            <TransactionProvider>


                                <div className="flex flex-col min-h-screen">
                                    {/* Fixed header */}
                                    <div className="fixed top-0 left-0 right-0 z-50">
                                        <Header />
                                    </div>

                                    {/* Main content with proper spacing */}
                                    <div className="pt-[60px]">
                                        <div className="flex-1">
                                            <Routes>
                                                <Route path="/" element={<Home />} />
                                                <Route path="/transaction" element={<Transaction />} />
                                                {/* Redirect any unknown routes to home */}
                                                <Route path="*" element={<Navigate to="/" replace />} />
                                            </Routes>
                                        </div>
                                    </div>
                                </div>
                                <Toaster />
            </TransactionProvider>
        </BrowserRouter>
    );
}

export default App;