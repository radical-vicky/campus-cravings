import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { BottomNav } from "@/components/layout/BottomNav";
import Index from "./pages/Index";
import RestaurantPage from "./pages/RestaurantPage";
import CartPage from "./pages/CartPage";
import OrdersPage from "./pages/OrdersPage";
import OrderTrackingPage from "./pages/OrderTrackingPage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-md mx-auto bg-background min-h-screen relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/order/:id" element={<OrderTrackingPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
