import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";
import ProtectedRoute from "./components/layout/ProtectedRoute.jsx";
import Loader from "./components/common/Loader.jsx";

// Public pages
const Home = lazy(() => import("./pages/Home.jsx"));
const About = lazy(() => import("./pages/static/About.jsx"));
const Contact = lazy(() => import("./pages/static/Contact.jsx"));
const FAQ = lazy(() => import("./pages/static/FAQ.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/static/PrivacyPolicy.jsx"));
const Terms = lazy(() => import("./pages/static/Terms.jsx"));
const NotFound = lazy(() => import("./pages/static/NotFound.jsx"));

// Repair flow
const RepairCategorySelect = lazy(() => import("./pages/repair/RepairCategorySelect.jsx"));
const RepairBrandSelect = lazy(() => import("./pages/repair/RepairBrandSelect.jsx"));
const RepairModelSelect = lazy(() => import("./pages/repair/RepairModelSelect.jsx"));
const RepairVariantSelect = lazy(() => import("./pages/repair/RepairVariantSelect.jsx"));
const RepairServiceSelect = lazy(() => import("./pages/repair/RepairServiceSelect.jsx"));
const RepairBookingForm = lazy(() => import("./pages/repair/RepairBookingForm.jsx"));
const ManualQuoteForm = lazy(() => import("./pages/repair/ManualQuoteForm.jsx"));
const BookingSuccess = lazy(() => import("./pages/repair/BookingSuccess.jsx"));
const RepairTracking = lazy(() => import("./pages/repair/RepairTracking.jsx"));

// Shop
const Shop = lazy(() => import("./pages/shop/Shop.jsx"));
const ProductDetails = lazy(() => import("./pages/shop/ProductDetails.jsx"));
const Cart = lazy(() => import("./pages/shop/Cart.jsx"));
const Checkout = lazy(() => import("./pages/shop/Checkout.jsx"));
const PaymentSuccess = lazy(() => import("./pages/shop/PaymentSuccess.jsx"));
const PaymentFailed = lazy(() => import("./pages/shop/PaymentFailed.jsx"));
const OrderTracking = lazy(() => import("./pages/shop/OrderTracking.jsx"));

// Auth
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword.jsx"));

// Profile
const Profile = lazy(() => import("./pages/profile/Profile.jsx"));
const ProfileOverview = lazy(() => import("./pages/profile/ProfileOverview.jsx"));
const ProfileAddresses = lazy(() => import("./pages/profile/ProfileAddresses.jsx"));
const ProfileOrders = lazy(() => import("./pages/profile/ProfileOrders.jsx"));
const ProfileOrderDetails = lazy(() => import("./pages/profile/ProfileOrderDetails.jsx"));
const ProfileRepairs = lazy(() => import("./pages/profile/ProfileRepairs.jsx"));
const ProfileWishlist = lazy(() => import("./pages/profile/ProfileWishlist.jsx"));
const ProfileSecurity = lazy(() => import("./pages/profile/ProfileSecurity.jsx"));

// Admin
const Dashboard = lazy(() => import("./admin/pages/Dashboard.jsx"));
const DeviceCategoriesAdmin = lazy(() => import("./admin/pages/DeviceCategoriesAdmin.jsx"));
const BrandsAdmin = lazy(() => import("./admin/pages/BrandsAdmin.jsx"));
const ModelsAdmin = lazy(() => import("./admin/pages/ModelsAdmin.jsx"));
const VariantsAdmin = lazy(() => import("./admin/pages/VariantsAdmin.jsx"));
const RepairServicesAdmin = lazy(() => import("./admin/pages/RepairServicesAdmin.jsx"));
const BookingsAdmin = lazy(() => import("./admin/pages/BookingsAdmin.jsx"));
const ProductsAdmin = lazy(() => import("./admin/pages/ProductsAdmin.jsx"));
const CategoriesAdmin = lazy(() => import("./admin/pages/CategoriesAdmin.jsx"));
const OrdersAdmin = lazy(() => import("./admin/pages/OrdersAdmin.jsx"));
const CustomersAdmin = lazy(() => import("./admin/pages/CustomersAdmin.jsx"));
const CouponsAdmin = lazy(() => import("./admin/pages/CouponsAdmin.jsx"));
const ReviewsAdmin = lazy(() => import("./admin/pages/ReviewsAdmin.jsx"));
const PaymentsAdmin = lazy(() => import("./admin/pages/PaymentsAdmin.jsx"));
const SettingsAdmin = lazy(() => import("./admin/pages/SettingsAdmin.jsx"));

function App() {
  return (
    <Suspense fallback={<Loader full />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />

          {/* Repair flow */}
          <Route path="/repair" element={<RepairCategorySelect />} />
          <Route path="/repair/booking" element={<RepairBookingForm />} />
          <Route path="/repair/manual-quote" element={<ManualQuoteForm />} />
          <Route path="/repair/booking-success/:bookingNumber" element={<BookingSuccess />} />
          <Route path="/repair/:categorySlug" element={<RepairBrandSelect />} />
          <Route path="/repair/:categorySlug/:brandSlug" element={<RepairModelSelect />} />
          <Route path="/repair/:categorySlug/:brandSlug/:modelSlug" element={<RepairVariantSelect />} />
          <Route path="/repair/:categorySlug/:brandSlug/:modelSlug/service" element={<RepairServiceSelect />} />
          <Route path="/track-repair" element={<RepairTracking />} />

          {/* Shop */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/track-order" element={<OrderTracking />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Profile */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>}>
            <Route index element={<ProfileOverview />} />
            <Route path="addresses" element={<ProfileAddresses />} />
            <Route path="orders" element={<ProfileOrders />} />
            <Route path="orders/:id" element={<ProfileOrderDetails />} />
            <Route path="repairs" element={<ProfileRepairs />} />
            <Route path="wishlist" element={<ProfileWishlist />} />
            <Route path="security" element={<ProfileSecurity />} />
          </Route>

          {/* Static */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="device-categories" element={<DeviceCategoriesAdmin />} />
          <Route path="brands" element={<BrandsAdmin />} />
          <Route path="models" element={<ModelsAdmin />} />
          <Route path="variants" element={<VariantsAdmin />} />
          <Route path="repair-services" element={<RepairServicesAdmin />} />
          <Route path="bookings" element={<BookingsAdmin />} />
          <Route path="products" element={<ProductsAdmin />} />
          <Route path="categories" element={<CategoriesAdmin />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="customers" element={<CustomersAdmin />} />
          <Route path="coupons" element={<CouponsAdmin />} />
          <Route path="reviews" element={<ReviewsAdmin />} />
          <Route path="payments" element={<PaymentsAdmin />} />
          <Route path="settings" element={<SettingsAdmin />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
