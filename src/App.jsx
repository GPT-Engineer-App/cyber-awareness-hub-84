import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { navItems } from "./nav-items";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {navItems.map(({ to, page }) => (
                <Route key={to} path={to} element={<ErrorBoundary>{page}</ErrorBoundary>} />
              ))}
              <Route path="/login" element={<ErrorBoundary><Login setIsAuthenticated={setIsAuthenticated} /></ErrorBoundary>} />
              <Route
                path="/admin"
                element={
                  <ErrorBoundary>
                    {isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
                  </ErrorBoundary>
                }
              />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
