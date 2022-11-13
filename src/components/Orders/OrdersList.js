import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Table,
  Modal,
  Dropdown,
  ButtonGroup,
  Pagination,
} from "react-bootstrap";
import { API_URL } from "../../connection/ConnectionSetup";
import { MdOutlineCancel, MdOutlineCheckCircle } from "react-icons/md";
import { toast } from "react-toastify";

const OrdersList = () => {
  const [pageIndex, setPageIndex] = useState(1);
  const [categoriesData, setCategoriesData] = useState(null);

  const [show, setShow] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [currentId, setCurrentId] = useState();
  const [ordersStatus, setOrdersStatus] = useState(null);
  const [pagination, setPagination] = useState(null);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };

  const fetchCategoryData = () => {
    axios.get(API_URL + "/orders?pageIndex=" + pageIndex).then((res) => {
      mapData(res.data.modelDatas);
      MapPagination({
        pageIndex: res.data.pageIndex,
        maxPage: res.data.maxPage,
      });
    });
  };

  const MapPagination = (data) => {
    console.log(data.maxPage);
    if (data.maxPage == 0) {
      setPagination(null);
      return;
    }
    let to = 3;
    let from = 1;
    if (data.pageIndex == 1) {
      from = 1;
      if (data.maxPage > 3) {
        to = from + 2;
      } else {
        to = data.maxPage;
      }
    } else if (data.pageIndex == data.maxPage) {
      to = data.maxPage;
      if (data.maxPage > 3) {
        from = to - 2;
      } else {
        from = 1;
      }
    } else {
      from = data.pageIndex - 1;
      to = data.pageIndex + 1;
    }
    let items = [];
    for (; from <= to; from++) {
      const index = from;
      items.push(
        <Pagination.Item
          key={from}
          onClick={() => {
            setPageIndex(index);
          }}
          active={from === data.pageIndex}
        >
          {from}
        </Pagination.Item>
      );
    }
    setPagination(items);
  };

  const mapData = (data) => {
    var mappedData = data.map((d) => {
      return (
        <tr
          className={`${
            d.status == "Done"
              ? "success"
              : d.status == "Canceled"
              ? "danger"
              : ""
          }`}
          key={d.id}
        >
          <td>{d.id}</td>
          <td>{new Date(d.orderDate).toLocaleDateString()}</td>
          <td>{d.status}</td>
          {d.status === "Pending" && (
            <td>
              <MdOutlineCancel
                onClick={() => {
                  handleShow();
                  setIsAdd(false);
                  setCurrentId(d.id);
                }}
                className="cursor-pointer"
              />{" "}
              {" | "}
              <MdOutlineCheckCircle
                onClick={() => {
                  handleShow();
                  setIsAdd(true);
                  setCurrentId(d.id);
                }}
                className="cursor-pointer"
              />
            </td>
          )}
        </tr>
      );
    });

    setCategoriesData(mappedData);
  };

  const submitHandler = () => {
    if (!isAdd) {
      axios.put(API_URL + "/orders/cancel", { id: currentId }).then(() => {
        fetchCategoryData();
        toast.success("Canceled!");
        setShow(false);
      });
    } else {
      axios.patch(API_URL + "/orders/confirm", { id: currentId }).then(() => {
        fetchCategoryData();
        toast.success("Confirmed!");
        setShow(false);
      });
    }
  };

  const filterHandler = () => {
    axios
      .get(
        API_URL +
          "/Orders/getbystatus?status=" +
          ordersStatus +
          "&pageIndex=" +
          pageIndex
      )
      .then((res) => {
        mapData(res.data.modelDatas);
        MapPagination({
          pageIndex: res.data.pageIndex,
          maxPage: res.data.maxPage,
        });
      });
  };

  useEffect(() => {
    console.log("effect");
    if (ordersStatus == null) {
      fetchCategoryData();
    } else {
      filterHandler();
    }
  }, [pageIndex, ordersStatus]);
  return (
    <Container>
      <Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isAdd ? "Confirming order" : "Canceling order"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isAdd ? "Confirming order" : "Canceling order"}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={submitHandler}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
      <Row className="my-3">
        <Col>
          <Dropdown as={ButtonGroup}>
            <Button
              onClick={() => {
                setOrdersStatus(null);
              }}
              variant="success"
            >
              {ordersStatus ? "Show all" : "Filter"}
            </Button>

            <Dropdown.Toggle
              split
              variant="success"
              id="dropdown-split-basic"
            />

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={() => {
                  setOrdersStatus(1);
                  setPageIndex(1);
                }}
              >
                Done
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setOrdersStatus(2);
                  setPageIndex(1);
                }}
              >
                Delivering
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  setPageIndex(1);
                  setOrdersStatus(5);
                }}
              >
                Canceled
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col md={11}>
          <Table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Order Date</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{<p>No orders</p> && categoriesData}</tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="d-flex justify-contents-end">
          <Pagination>{pagination}</Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default OrdersList;
