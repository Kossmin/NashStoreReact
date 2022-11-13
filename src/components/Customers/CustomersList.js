import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Pagination,
  Row,
  Table,
  Modal,
} from "react-bootstrap";
import { MdPersonAdd, MdPersonOff } from "react-icons/md";
import { toast } from "react-toastify";
import { API_URL } from "../../connection/ConnectionSetup";

const CustomersList = () => {
  const [customersData, setCustomersData] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [show, setShow] = useState(false);
  const [isBan, setIsBan] = useState(true);
  const [currentId, setCurrentId] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const fetchCustomers = () => {
    axios.get(API_URL + "/Users?pageIndex=" + pageIndex).then((res) => {
      MapPagination({
        pageIndex: res.data.pageIndex,
        maxPage: res.data.maxPage,
      });
      mapData(res.data.modelDatas);
    });
  };

  const mapData = (data) => {
    const mappedData = data.map((d) => {
      return (
        <tr className={d.isBanned ? "danger" : ""} key={d.userName}>
          <td>{d.userName}</td>
          <td>{d.email}</td>
          <td>
            {!d.isBanned ? (
              <MdPersonOff
                onClick={() => {
                  handleShow();
                  setIsBan(true);
                  setCurrentId(d.id);
                }}
              />
            ) : (
              <MdPersonAdd
                onClick={() => {
                  handleShow();
                  setIsBan(false);
                  setCurrentId(d.id);
                }}
              />
            )}
          </td>
        </tr>
      );
    });

    setCustomersData(mappedData);
  };

  const MapPagination = (data) => {
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

  const toggleUserStatus = () => {
    axios.put(API_URL + "/Users/toggle", { id: currentId }).then(() => {
      if (isBan) {
        toast.success("User is banned");
      } else {
        toast.success("User is unbanned");
      }
      setShow(false);
      fetchCustomers();
    });
  };

  useEffect(() => {
    console.log(pageIndex);
    fetchCustomers();
  }, [pageIndex]);
  return (
    <Container>
      <Row>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{isBan ? "Ban user" : "Unban User"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>This action will effect to your customer!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={toggleUserStatus}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </Row>
      <Row className="mt-5">
        <Col md={11}>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{customersData.length > 0 && customersData}</tbody>
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

export default CustomersList;
