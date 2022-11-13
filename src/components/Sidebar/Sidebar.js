import { Button, Col, Container, Image, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

import classes from "./Sidebar.module.css";

import img from "../../assets/nashstore-logo.png";
import {
  BsFillPieChartFill,
  BsFillFileEarmarkPersonFill,
} from "react-icons/bs";
import { RiComputerFill } from "react-icons/ri";
import { IoReceipt } from "react-icons/io5";
import { AiFillTags } from "react-icons/ai";

const Sidebar = (props) => {
  return (
    <Col
      className={`${classes.sidebar} position-sticky top-0 start-0 bg-dark`}
      md={2}
    >
      <Container className="mb-5">
        <Navbar.Brand href="#home">
          <Image src={img} width="100%" rounded fluid />
        </Navbar.Brand>
      </Container>
      <Nav defaultActiveKey="/main/products" className="flex-column">
        <Nav.Link as={Link} to="/main">
          <div className="d-grid">
            <Button className="d-flex align-items-center" variant="dark">
              <BsFillPieChartFill /> &nbsp; Dashboard
            </Button>
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to="/main/products/productslist" eventKey="link-1">
          <div className="d-grid">
            <Button className="d-flex align-items-center" variant="dark">
              <RiComputerFill />
              &nbsp; Products
            </Button>
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to="/main/categories" eventKey="link-1">
          <div className="d-grid">
            <Button className="d-flex align-items-center" variant="dark">
              <AiFillTags />
              &nbsp; Categories
            </Button>
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to="/main/orders" eventKey="link-2">
          <div className="d-grid">
            <Button className="d-flex align-items-center" variant="dark">
              <IoReceipt />
              &nbsp; Orders
            </Button>
          </div>
        </Nav.Link>
        <Nav.Link as={Link} to="/main/customers" eventKey="disabled">
          <div className="d-grid">
            <Button className="d-flex align-items-center" variant="dark">
              <BsFillFileEarmarkPersonFill />
              &nbsp; Customers
            </Button>
          </div>
        </Nav.Link>
      </Nav>
    </Col>
  );
};

export default Sidebar;
