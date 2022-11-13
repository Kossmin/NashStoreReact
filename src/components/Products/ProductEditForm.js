import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { API_URL } from "../../connection/ConnectionSetup";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";

const ProductEditForm = () => {
  const { id } = useParams();

  const picturesRef = useRef();
  const productNameRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const importedDateRef = useRef();
  const descriptionRef = useRef();
  const isDeletedRef = useRef();
  const [pictures, setPictures] = useState([]);
  const [categoryValue, setCategoryValue] = useState(undefined);
  const [convertPictures, setConvertPictures] = useState(null);
  const [productData, setProductData] = useState({
    id: "",
    name: "",
    description: "",
    categoryId: "",
    price: "",
    quantity: "",
    imgUrl: [],
    isDeleted: false,
    importedDate: new Date(),
    version: 1,
  });
  const [categories, setCategories] = useState(null);

  const navigator = useNavigate();

  const fetchProductData = () => {
    axios.get(API_URL + "/products/" + id).then((response) => {
      setProductData(response.data);
      setPictures(response.data.imgUrls);
      setCategoryValue(response.data.categoryId);
      isDeletedRef.current.checked = !response.data.isDeleted;
    });
  };

  const fetchCategorySelect = () => {
    axios.get(API_URL + "/Categories").then((response) => {
      const data = response.data.map((category) => {
        return (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        );
      });
      setCategories(data);
    });
  };

  useEffect(() => {
    fetchProductData();
    fetchCategorySelect();
  }, []);

  const setDefaultValue = () => {
    const date = new Date(productData.importedDate);

    productNameRef.current.value = productData.name;
    quantityRef.current.value = productData.quantity;
    priceRef.current.value = productData.price;
    importedDateRef.current.value = date.toISOString().split("T")[0];
    descriptionRef.current.value = productData.description;
    isDeletedRef.current.checked = !productData.isDeleted;
  };

  useEffect(() => {
    setDefaultValue();
  }, [productData]);

  const AddPicture = (e) => {
    setPictures([]);
    for (let index = 0; index < e.target.files.length; index++) {
      setPictures((o) => [...o, URL.createObjectURL(e.target.files[index])]);
    }
  };

  const ShowPicture = () => {
    if (pictures.length > 0) {
      const convertedData = pictures.map((p) => {
        return (
          <Col key={p} md={4}>
            <img width={"100%"} src={p} />
          </Col>
        );
      });

      setConvertPictures(convertedData);
    } else {
      setConvertPictures(null);
    }
  };

  useEffect(() => {
    ShowPicture();
  }, [pictures]);

  const ChangeCategory = (e) => {
    setCategoryValue(e.target.value);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(categoryValue);
    const formData = new FormData();
    formData.append("Id", productData.id);
    formData.append("Name", productNameRef.current.value);
    if (categoryValue) {
      formData.append("CategoryId", categoryValue);
    }
    formData.append("Price", priceRef.current.value);
    formData.append("Quantity", quantityRef.current.value);
    formData.append("Description", descriptionRef.current.value);
    formData.append("ImportedDate", importedDateRef.current.value);
    formData.append("IsDeleted", !isDeletedRef.current.checked);
    formData.append("Version", productData.version);

    if (picturesRef.current.files.length > 0) {
      for (let index = 0; index < picturesRef.current.files.length; index++) {
        formData.append("Imgs", picturesRef.current.files[index]);
      }
    } else {
      formData.append("Imgs", {});
    }

    axios.put(API_URL + "/products", formData).then(
      () => navigator("/main/products/productslist"),
      (e) => {
        toast.error(e.response.data.message);
        console.log(e);
        fetchProductData();
        toast.success("Data is updated");
      }
    );
  };

  return (
    <Container>
      <Row className="my-3">
        <h1>{productData.name}</h1>
      </Row>
      <Row className="mt-3">
        <Card as={Col} md={6}>
          <Form onSubmit={submitHandler} encType="multipart/form-data">
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="inputProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control required ref={productNameRef} type="text" />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      value={categoryValue}
                      required
                      onChange={(e) => ChangeCategory(e)}
                    >
                      <option value={""}>Open this select menu</option>
                      {<></> && categories}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="inputProductName">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control required type="number" ref={quantityRef} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="inputProductName">
                    <Form.Label>Price</Form.Label>
                    <InputGroup>
                      <Form.Control required type="number" ref={priceRef} />
                      <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3" controlId="inputProductName">
                    <Form.Label>Import date</Form.Label>
                    <Form.Control required ref={importedDateRef} type="date" />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3" controlId="inputDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  required
                  as="textarea"
                  rows={3}
                  ref={descriptionRef}
                />
              </Form.Group>
              <Form.Group controlId="formFileMultiple" className="mb-3">
                <Form.Label>Product Images</Form.Label>
                <Form.Control
                  onChange={(e) => AddPicture(e)}
                  ref={picturesRef}
                  type="file"
                  multiple
                />
              </Form.Group>
              <Form.Check
                ref={isDeletedRef}
                type="switch"
                id="custom-switch"
                label="Show this product?"
              />
              <Row>{<></> && convertPictures}</Row>
            </Card.Body>
            <Card.Footer>
              <Button type="submit">Confirm</Button>
            </Card.Footer>
          </Form>
        </Card>
      </Row>
    </Container>
  );
};

export default ProductEditForm;
