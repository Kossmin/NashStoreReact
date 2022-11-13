import { Col, Container, Row } from "react-bootstrap";
import { Routes, Route, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import Dashboard from "../components/Dashboard/Dashboard";
import ProductsList from "../components/Products/ProductsList";
import ProductAddForm from "../components/Products/ProductAddForm";
import ProductEditForm from "../components/Products/ProductEditForm";
import CategoriesList from "../components/Categories/CategoriesList";
import OrdersList from "../components/Orders/OrdersList";
import CustomersList from "../components/Customers/CustomersList";
const MainPage = () => {
  return (
    <Container fluid>
      <Row>
        <Sidebar />
        <Col md={10} style={{ padding: 0 }}>
          <Header />
          <Outlet />
        </Col>
      </Row>
      <ToastContainer />
    </Container>
  );
};

export default MainPage;
