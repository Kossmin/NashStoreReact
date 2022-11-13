import axios from "axios";
import { useRef, useState, useEffect } from "react";
import {
  Card,
  Container,
  Form,
  Row,
  Col,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { API_URL } from "../../connection/ConnectionSetup";

const ProductAddForm = (props) => {
  const picturesRef = useRef();
  const productNameRef = useRef();
  const quantityRef = useRef();
  const priceRef = useRef();
  const importedDateRef = useRef();
  const descriptionRef = useRef();
  const isDeletedRef = useRef();

  const [pictures, setPictures] = useState([]);

  const [convertPictures, setConvertPictures] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoryValue, setCategoryValue] = useState(undefined);

  const navigator = useNavigate();

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
    ShowPicture();
  }, [pictures]);

  useEffect(() => {
    fetchCategorySelect();
  }, []);

  const ChangeCategory = (e) => {
    setCategoryValue(e.target.value);
  };

  const SubmitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("Name", productNameRef.current.value);
    if (categoryValue) {
      formData.append("CategoryId", categoryValue);
    }
    formData.append("Price", priceRef.current.value);
    formData.append("Quantity", quantityRef.current.value);
    formData.append("Description", descriptionRef.current.value);
    formData.append("ImportedDate", importedDateRef.current.value);
    formData.append("IsDeleted", !isDeletedRef.current.checked);
    for (let index = 0; index < picturesRef.current.files.length; index++) {
      formData.append("Imgs", picturesRef.current.files[index]);
    }

    axios
      .post(API_URL + "/Products/add", formData)
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        navigator("/main/products/productslist");
        toast.success("Add success!");
      });
  };

  return (
    <Container>
      <Row className="my-3">
        <h1>Add new Product</h1>
      </Row>
      <Row className="mt-3">
        <Card as={Col} md={6}>
          <Form onSubmit={SubmitHandler} encType="multipart/form-data">
            <Card.Body>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="inputProductName">
                    <Form.Label>Product Name</Form.Label>
                    <Form.Control required type="text" ref={productNameRef} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      value={categoryValue}
                      onChange={(e) => ChangeCategory(e)}
                      aria-label="Default select example"
                    >
                      <option value={null}>Open this select menu</option>
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
                    <Form.Control required type="date" ref={importedDateRef} />
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

export default ProductAddForm;
