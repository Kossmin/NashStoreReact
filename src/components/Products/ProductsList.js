import axios from "axios";
import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Row,
  Pagination,
  Modal,
  Button,
  Col,
  Form,
  Input,
  InputGroup,
} from "react-bootstrap";
import { useForm } from "react-hook-form";

import { BsFillPencilFill, BsCartXFill, BsCartPlusFill } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { toast } from "react-toastify";

import { API_URL } from "../../connection/ConnectionSetup";
import { Link } from "react-router-dom";

const ProductsList = () => {
  const [productsList, setProductsList] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pagination, setPagination] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [isAdd, setIsAdd] = useState(null);
  const [productId, setProductId] = useState(null);
  const [categoriesSelect, setCategoriesSelect] = useState(null);
  const [search, setSearch] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const fetchData = () => {
    axios.get(API_URL + "/Products?pageIndex=" + pageIndex).then(
      (x) => mapData(x),
      (err) => console.log(err)
    );
  };
  const mapData = (x) => {
    const resultData = x.data.modelDatas.map((model) => {
      return (
        <tr className={model.isDeleted ? "danger" : "success"} key={model.id}>
          <td>{model.id}</td>
          <td>{model.name}</td>
          <td>{model.categoryName}</td>
          <td>{model.price}</td>
          <td>{model.quantity}</td>
          <td>
            <Link to={`/main/products/edit-form/${model.id}`}>
              <BsFillPencilFill />
            </Link>{" "}
            |{" "}
            {model.isDeleted ? (
              <BsCartPlusFill
                className={["cursor-pointer"]}
                onClick={() => handleAddShow(model.id)}
              />
            ) : (
              <BsCartXFill
                className={["cursor-pointer"]}
                onClick={() => handleDeleteShow(model.id)}
              />
            )}
          </td>
        </tr>
      );
    });
    MapPagination({ pageIndex: x.data.pageIndex, maxPage: x.data.maxPage });
    setProductsList(resultData);
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

  useEffect(() => {
    if (search == null) {
      fetchData();
    } else {
      fetchSearchedData();
    }
  }, [pageIndex, search]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get(API_URL + "/Categories").then((response) => {
      const data = response.data.map((category) => {
        return (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        );
      });
      setCategoriesSelect(data);
    });
  };

  const handleAddShow = (data) => {
    setProductId(data);
    setIsShow(true);
    setIsAdd(true);
  };

  const handleDeleteShow = (data) => {
    setProductId(data);
    setIsShow(true);
    setIsAdd(false);
  };

  const handleClose = () => {
    setProductId(null);
    setIsShow(false);
  };

  const toggleProductStatus = () => {
    console.log(productId);
    axios
      .post(API_URL + "/Products/toggle", {
        id: productId,
      })
      .then((res) => {
        handleClose();
        fetchData();
        toast.success(isAdd ? "Show product success" : "Product is hidden");
      });
  };

  const searchSubmitHandler = (data) => {
    if (data.searchName == "" && data.searchCategory == "") {
      return;
    } else {
      setSearch({
        searchName: data.searchName,
        searchCategory: data.searchCategory,
      });
    }
    setPageIndex(1);

    axios
      .post(API_URL + "/Products/searchadmin", {
        PageIndex: 1,
        ProductName: data.searchName,
        CategoryId: data.searchCategory === "" ? 0 : data.searchCategory,
      })
      .then(
        (response) => {
          mapData(response);
        },
        (e) => {
          toast.error(e.response.data.message);
        }
      );
  };

  const fetchSearchedData = () => {
    axios
      .post(API_URL + "/Products/search", {
        pageIndex: pageIndex,
        productName: search.searchName,
        categoryId: search.searchCategory === "" ? 0 : search.searchCategory,
      })
      .then((response) => {
        mapData(response);
      });
  };

  return (
    <Container className="">
      <Row className="mt-3">
        <Col md={10}>
          <Form onSubmit={handleSubmit(searchSubmitHandler)}>
            <Row>
              <Col md={3}>
                <Form.Select {...register("searchCategory")}>
                  <option value="">Categories</option>
                  {categoriesSelect && categoriesSelect}
                </Form.Select>
              </Col>
              <Col>
                <InputGroup>
                  <Form.Control
                    {...register("searchName")}
                    placeholder="Search product by name"
                  />
                  <Button type="submit">
                    Search &nbsp;
                    <BiSearchAlt2 />
                  </Button>
                </InputGroup>
              </Col>
              <Col>
                {search && (
                  <Button
                    onClick={() => {
                      setSearch(null);
                      setPageIndex(1);
                    }}
                  >
                    Show all
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Table className="mt-5">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{productsList == null ? <></> : productsList}</tbody>
      </Table>
      <Container>
        <Row>
          <Col>
            <Link to="/main/products/add-form">
              <Button>Create new product</Button>
            </Link>
          </Col>
          <Col md={6} className="d-flex justify-contents-end">
            <Pagination>{pagination}</Pagination>
          </Col>
        </Row>
      </Container>
      {/* modal */}
      <Modal show={isShow} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isAdd ? "Show product" : "Hide product"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAdd
            ? "Please check all the information, this product will be shown to customer."
            : "Are you sure that you want to hide this product from customer?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={toggleProductStatus}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsList;
