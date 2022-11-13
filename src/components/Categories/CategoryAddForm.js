import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";

const CategoryAddForm = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  return (
    <Form onSubmit={handleSubmit((e) => props.onSubmitHandler(e.categoryName))}>
      <Form.Group className="mb-3">
        <Form.Label>Category Name:</Form.Label>
        <Form.Control
          {...register("categoryName")}
          type="text"
          placeholder="Enter Category Name"
        />
      </Form.Group>
      <Form.Group>
        <Button className="me-2" type="submit">
          Add new
        </Button>
        <Button variant="secondary" onClick={props.onCloseHandler}>
          Close
        </Button>
      </Form.Group>
    </Form>
  );
};

export default CategoryAddForm;
