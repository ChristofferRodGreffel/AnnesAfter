import { Route, Routes, useParams } from "react-router-dom";
import CreateMenuProduct from "./pages/admin/CreateMenuProduct";
import LandingPage from "./pages/customer/LandingPage";
import MenuOverview from "./pages/admin/MenuOverview";
import OrderOverview from "./pages/admin/OrderOverview";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CustomerProfile from "./pages/customer/CustomerProfile";
import SignIn from "./pages/customer/SignIn";
import SignUp from "./pages/customer/SignUp";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import EditMenu from "./pages/admin/EditMenu";
import CustomizeProduct from "./pages/customer/CustomizeProduct";
import CheckoutOverview from "./pages/customer/CheckoutOverview";
import AdminSettings from "./pages/admin/AdminSettings";
import Ingredients from "./pages/admin/Ingredients";
import ScrollToTop from "./helperfunctions/ScrollToTop";
import OrderStatus from "./pages/customer/OrderStatus";
import OrderDetails from "./pages/admin/OrderDetails";
import OrderHistory from "./pages/admin/OrderHistory";
import Statistics from "./pages/admin/Statistics";
import Favorites from "./pages/customer/Favorites";
import AdminGuides from "./pages/admin/AdminGuides";
import AllCustomerOrders from "./pages/customer/AllCustomerOrders";

function App() {
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      if (user) {
        const uid = user.uid;
        checkAdminStatus(uid);
      }
    });
  }, []);

  const checkAdminStatus = async (user) => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, "admin"));
    querySnapshot.forEach((doc) => {
      if (doc.id === user) {
        setAdmin(true);
      }
    });
  };

  return (
    <>
      <ToastContainer />
      <Routes>
        {admin && (
          <>
            <Route path="/menu-oversigt/opret-produkt" element={<CreateMenuProduct />} />
            <Route path="/menu-oversigt/rediger-menu" element={<EditMenu />} />
            <Route path="/menu-oversigt/ingredienser" element={<Ingredients />} />
            <Route path="/menu-oversigt" element={<MenuOverview />} />
            <Route path="/ordre-historik" element={<OrderHistory />} />
            <Route path="/ordre-oversigt" element={<OrderOverview />} />
            <Route path="/ordre-oversigt/ordredetaljer/:orderDocId" element={<OrderDetails />} />
            <Route path="/statistik" element={<Statistics />} />
            <Route path="/admin-indstillinger" element={<AdminSettings />} />
            <Route path="/admin-guides" element={<AdminGuides />} />
          </>
        )}
        <Route path="/kurv" element={<CheckoutOverview />} />
        <Route path="/profil" element={<CustomerProfile />} />
        <Route path="/bestil-online" element={<LandingPage />} />
        <Route path="/følg-bestilling/:orderId" element={<OrderStatus />} />
        <Route path="/bestillinger" element={<AllCustomerOrders />} />
        <Route path="/log-ind" element={<SignIn />} />
        <Route path="/favoritter" element={<Favorites />} />
        <Route path="/opret-profil" element={<SignUp />} />
        <Route path="/bestil-online/:productName" element={<CustomizeProduct />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}

export default App;
