import React, { lazy } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Suspense } from "react";
import FallBackLoader from "../components/FallBackLoader/FallBackLoader";
import CartPage from "../pages/CartPage";
import FinalPage from "../pages/FinalPage";
const Login = lazy(() => import("../components/Login/Login"));
const Home = lazy(() => import("../pages/HomePage"));
const Signup = lazy(() => import("../components/SignUp/Signup"));
const ResetPassword = lazy(() =>
  import("../components/ResetPassword/ResetPassword")
);
const ChangePassword = lazy(() =>
  import("../components/ChangePassword/ChangePassword")
);
const Dashboard = lazy(() => import("../components/Admin/Dashboard/Dashboard"));
const OrdersPage = lazy(() => import("../pages/OrdersPage"));
const ViewOrderPage = lazy(() => import("../pages/ViewOrderPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const WishListPage = lazy(() => import("../pages/WishListPage"));
const ViewProductPage = lazy(() => import("../pages/ViewProductPage"));
const AllProductsPage = lazy(() => import("../pages/AllProductsPage"));
const ReturnPolicyPage = lazy(() => import("../pages/ReturnPolicyPage"));
const AboutUsPage = lazy(() => import("../pages/AboutUsPage"));
const ShippingPage = lazy(() => import("../pages/ShippingPage"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage"));
const FAQSPage = lazy(() => import("../pages/FAQSPage"));

const PublicRoutes = () => {
  const LoadingFallback = () => (
    <div>
      <FallBackLoader />
    </div>
  );

  const user = useSelector((state) => state.auth);
  const userRole = useSelector((state) => state.auth.user?.role);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Home />
            </Suspense>
          }
        />

        <Route
          path="/login"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Signup />
            </Suspense>
          }
        />
        <Route
          path="/forgotpassword"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ResetPassword />
            </Suspense>
          }
        />
        <Route
          path="/products"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AllProductsPage />{" "}
            </Suspense>
          }
        />
        <Route
          path="/return/policy"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ReturnPolicyPage />{" "}
            </Suspense>
          }
        />
        <Route
          path="/aboutus"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <AboutUsPage />{" "}
            </Suspense>
          }
        />
        <Route
          path="/shipping"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <ShippingPage />{" "}
            </Suspense>
          }
        />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <PrivacyPage />{" "}
            </Suspense>
          }
        />
        <Route
          path="/faqs"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <FAQSPage />{" "}
            </Suspense>
          }
        />
        {user.isAuthenticated ? (
          <>
            <Route
              path="/profile"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ProfilePage />{" "}
                </Suspense>
              }
            />
            <Route
              path="/cart"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <CartPage />{" "}
                </Suspense>
              }
            />
            <Route
              path="/changepassword"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ChangePassword />{" "}
                </Suspense>
              }
            />
            <Route
              path="/checkout"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <FinalPage />{" "}
                </Suspense>
              }
            />
            <Route
              path="/orders"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <OrdersPage />
                </Suspense>
              }
            />
            <Route
              path="/wishlist"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <WishListPage />{" "}
                </Suspense>
              }
            />
            <Route
              path="/products/viewproduct/:productId"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ViewProductPage />{" "}
                </Suspense>
              }
            />
            <Route
              path="/view/order/:orderID"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <ViewOrderPage />{" "}
                </Suspense>
              }
            />
          </>
        ) : (
          <Route
            path="*"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Navigate to="/login" />{" "}
              </Suspense>
            }
          />
        )}

        {user.isAuthenticated && userRole === "admin" ? (
          <>
            <Route
              path="/admin/dashboard"
              element={
                <Suspense fallback={<LoadingFallback />}>
                  <Dashboard />{" "}
                </Suspense>
              }
            />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </BrowserRouter>
  );
};

export default PublicRoutes;
