import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clients from "./pages/Clients";
import Payments from "./pages/Payments";
import AiInsights from "./pages/AiInsights";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerDashboard from "./pages/CustomerDashboard";
import Loading, { setProgress } from "./components/ui/Loading";
import { useLoading } from "./context/LoadingProvider";

function App() {
    const { isLoading, progress, setProgress: updateProgress } = useLoading();

    useEffect(() => {
        const { loaded } = setProgress(updateProgress);
        
        const handleLoad = () => {
            loaded();
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        // Fallback for fast loading environments or if load event is missed
        const timer = setTimeout(handleLoad, 1500);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(timer);
        };
    }, [updateProgress]);

    return (
        <>
            {isLoading && <Loading percent={progress} />}
            <Router>
                <Routes>
                    {/* Landing page */}
                    <Route path="/" element={<LandingPage />} />

                    {/* Authentication */}
                    <Route path="/login" element={<Login />} />

                    {/* Customer Dashboard (Portal) */}
                    <Route path="/customer-dashboard" element={<CustomerDashboard />} />

                    {/* Admin Routes (Protected) */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/clients"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Clients />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/payments"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Payments />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/ai-insights"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <AiInsights />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Settings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;
