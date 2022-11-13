import logo from "./logo.svg";
import "./App.css";
import MainPage from "./layout/MainPage";
import LoginPage from "./layout/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard/Dashboard";
import ProductsList from "./components/Products/ProductsList";
import ProductAddForm from "./components/Products/ProductAddForm";
import ProductEditForm from "./components/Products/ProductEditForm";
import CategoriesList from "./components/Categories/CategoriesList";
import OrdersList from "./components/Orders/OrdersList";
import CustomersList from "./components/Customers/CustomersList";
import LoginContext, { LoginContextProvider } from "./store/LoginContext";
import { useContext, useEffect } from "react";

function App() {
  const loginCtx = useContext(LoginContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      loginCtx.setState(true);
    }
  });
  return (
    <>
      {loginCtx.isLoggedIn ? (
        <Routes>
          <Route path="main" element={<MainPage />}>
            <Route path="products" element={<Outlet />}>
              <Route path="productslist" element={<ProductsList />}></Route>
              <Route path="add-form" element={<ProductAddForm />} />
              <Route path="edit-form/:id" element={<ProductEditForm />} />
              <Route path="" element={<ProductsList />} />
            </Route>
            <Route path="categories" element={<CategoriesList />} />

            <Route path="orders" element={<OrdersList />} />
            <Route path="customers" element={<CustomersList />} />
            <Route path="/main/" element={<Dashboard />}></Route>
            <Route path="categories" element={<CategoriesList />} />
            <Route path="*" element={<Dashboard />}></Route>
          </Route>
          <Route path="*" element={<h1>Wrong URL</h1>} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<LoginPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
