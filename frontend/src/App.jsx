import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import { UserTypeProvider } from "./context/UserTypeContext";
import { ProductsProvider } from "./context/ProductContext";
import Cart from "./pages/Cart";
import { OrderProvider } from "./context/OrderContext";
import ProtectedRoute from "./components/protectedRoutes";
import Admins from "./pages/admins";
import OrderMetaProvider from "./context/OrderMetaContext";



function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
      <UserTypeProvider>
        <ProductsProvider>
         <OrderProvider>
          <OrderMetaProvider>
          <Routes>
            <Route path="/cart" element={
            <ProtectedRoute>
            <Cart />
            </ProtectedRoute>
            } />
            <Route path="/" element={<Products />} />
            <Route path="/products" element={<Products />} />
            <Route path="/admins" element={<Admins />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<RegisterAndLogout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </OrderMetaProvider>
          </OrderProvider>
        </ProductsProvider>
      </UserTypeProvider>
    </BrowserRouter>
  );
}


export default App;
