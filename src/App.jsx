// src/App.jsx - Production-Ready Version
import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import PrivateRoute from "./components/auth/PrivateRoute";
import Navbar from "./components/common/Navbar";
import CategoryNav from "./components/common/CategoryNav";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";
import NotFound from "./pages/NotFound";
import Footer from "./components/common/Footer";

// LAZY LOADING - Code splitting for better performance
const Home = lazy(() => import("./pages/Home"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const Profile = lazy(() => import("./pages/Profile"));
const BestSellers = lazy(() => import("./pages/BestSellers"));
const NewArrivals = lazy(() => import("./pages/NewArrivals"));
const Sales = lazy(() => import("./pages/Sales"));
const GiftCards = lazy(() => import("./pages/GiftCards"));
const CustomerService = lazy(() => import("./pages/CustomerService"));

// Scroll restoration component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <LoadingSpinner size="large" />
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      {/* Catches errors in the entire app */}
      <Router basename="/Unity-Store">
        <ScrollToTop /> {/* 🔄 Resets scroll on page change */}
        <AuthProvider>
          <CartProvider>
            <OrderProvider>
              <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <CategoryNav />

                {/* Toast notifications */}
                <Toaster
                  position="top-center"
                  reverseOrder={false}
                  gutter={8}
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: "#1a2b4b",
                      color: "#fff",
                      border: "1px solid #c5a059",
                    },
                  }}
                />

                {/* Main content with Suspense for lazy loading */}
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Home />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route
                        path="/category/:categoryId"
                        element={<CategoryProducts />}
                      />
                      <Route path="/cart" element={<Cart />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/best-sellers" element={<BestSellers />} />
                      <Route path="/new-arrivals" element={<NewArrivals />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/gift-cards" element={<GiftCards />} />
                      <Route
                        path="/customer-service"
                        element={<CustomerService />}
                      />

                      {/* Protected Routes */}
                      <Route
                        path="/checkout"
                        element={
                          <PrivateRoute>
                            <Checkout />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/my-orders"
                        element={
                          <PrivateRoute>
                            <MyOrders />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <PrivateRoute>
                            <Profile />
                          </PrivateRoute>
                        }
                      />

                      {/* 404 Route - Must be last */}
                      <Route path="/404" element={<NotFound />} />
                      <Route
                        path="*"
                        element={<Navigate to="/404" replace />}
                      />
                    </Routes>
                  </Suspense>
                </main>

                {/* <Footer /> */}
                <Footer />
              </div>
            </OrderProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
