import { useState, useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import LoginContext from "../../store/LoginContext";

const Header = () => {
  const [activeTab, setActiveTab] = useState("test2");

  const changeTab = (eventKey) => {
    setActiveTab(eventKey);
  };

  const loginCtx = useContext(LoginContext);

  return (
    <Navbar bg="dark" variant="dark" sticky="top">
      <Container fluid>
        <Navbar.Brand href="#home"></Navbar.Brand>
        <Nav as="ul" activeKey={activeTab}>
          <Nav.Item as="li">
            <Nav.Link
              onClick={() => {
                loginCtx.logoutHander();
              }}
            >
              Logout
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default Header;
