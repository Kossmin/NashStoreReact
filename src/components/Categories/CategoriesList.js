import axios from "axios";
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import { useForm } from "react-hook-form";
import {
  BsFillPencilFill,
  BsCartXFill,
  BsCartPlusFill,
  BsCheckCircle,
} from "react-icons/bs";
import { ImCancelCircle } from "react-icons/im";
import { toast } from "react-toastify";
import { API_URL } from "../../connection/ConnectionSetup";
import CategoryAddForm from "./CategoryAddForm";
import CategoryEditForm from "./CategoryEditForm";

const CategoriesList = () => {
  const [categories, setCategories] = useState(null);
  const [show, setShow] = useState(false);
  const [showConfirm, setConfirmShow] = useState(false);
  const [currentCate, setCurrentCate] = useState(null);
  const [isAdd, setIsAdd] = useState(true);
  const [categoryId, setCategoryId] = useState(null);

  const handleConfirmClose = () => {
    setCategoryId(null);
    setConfirmShow(false);
  };
  const handleConfirmShow = (id) => {
    setCategoryId(id);
    setConfirmShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setCurrentCate({});
  };
  const handleShow = () => {
    setIsAdd(true);
    setShow(true);
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const fetchCategoryData = () => {
    axios.get(API_URL + "/Categories/available").then((response) => {
      mapData(response.data);
    });
  };

  const toggleCategoryStatus = (id) => {
    console.log(id);
    axios.put(API_URL + "/Categories/toggle", { id: id }).then((response) => {
      toast.success("Success");
      fetchCategoryData();
    });
  };
  const mapData = (data) => {
    const mappedData = data.map((d) => {
      return (
        <tr className={`${d.isDeleted ? "danger" : ""}`} key={d.id}>
          <td>{d.id}</td>
          <td>{d.name}</td>
          <td>
            <BsFillPencilFill
              onClick={() => {
                onShowForm(d.id, d.name, d.isDeleted);
              }}
            />{" "}
            {" | "}{" "}
            {d.isDeleted ? (
              <BsCartPlusFill
                onClick={() => handleConfirmShow(d.id)}
                className="cursor-pointer"
              />
            ) : (
              <BsCartXFill
                onClick={() => handleConfirmShow(d.id)}
                className="cursor-pointer"
              />
            )}
          </td>
        </tr>
      );
    });
    setCategories(mappedData);
  };

  const submitHandler = (name, id, isDeleted) => {
    if (isAdd) {
      axios
        .post(API_URL + "/Categories", { id: 0, name: name })
        .then(async () => {
          setShow(false);
          toast.success("Add success!");
          fetchCategoryData();
        });
    } else {
      axios
        .patch(API_URL + "/Categories", {
          id: id,
          name: name,
          isDeleted: isDeleted,
        })
        .then(async () => {
          setShow(false);
          toast.success("Update success!");
          fetchCategoryData();
        });
    }
  };

  const onShowForm = (id, name, isDeleted) => {
    setIsAdd(false);
    setShow(true);
    setCurrentCate({ id: id, name: name, isDeleted: isDeleted });
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <Container>
      <Modal show={showConfirm} onHide={handleConfirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isAdd ? "Adding new " : "Updating "} category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          All of the products of this category will be affected.
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              toggleCategoryStatus(categoryId);
              setConfirmShow(false);
            }}
            className="me-2"
          >
            Confirm
          </Button>
          <Button onClick={handleConfirmClose} variant="secondary">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <h1>Categories</h1>
      <Row>
        <Col>
          <Button variant="primary" onClick={handleShow}>
            Create new
          </Button>
        </Col>

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {isAdd ? "Adding new " : "Updating "} category
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {isAdd ? (
              <CategoryAddForm
                onSubmitHandler={submitHandler}
                onCloseHandler={handleClose}
              />
            ) : (
              <CategoryEditForm
                onCloseHandler={handleClose}
                onSubmitHandler={submitHandler}
                name={currentCate.name}
                categoryId={currentCate.id}
                isDeleted={currentCate.isDeleted}
              />
            )}
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </Row>
      <Row className="mt-5 ms-3 me-3">
        <Table striped hover bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>{categories && categories}</tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default CategoriesList;
