import { useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { set, useForm } from "react-hook-form";

const CategoryEditForm = (props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    setValue("categoryName", props.name);
  }, []);
  return (
    <Form
      onSubmit={handleSubmit((e) =>
        props.onSubmitHandler(e.categoryName, props.categoryId, props.isDeleted)
      )}
    >
      <Form.Group className="mb-3">
        <Form.Label>Category Name:</Form.Label>
        <Form.Control
          {...register("categoryName")}
          type="text"
          required
          placeholder="Enter Category Name"
        />
      </Form.Group>
      <Form.Group>
        <Button className="me-2" type="submit">
          Update
        </Button>
        <Button variant="secondary" onClick={props.onCloseHandler}>
          Close
        </Button>
      </Form.Group>
    </Form>
  );
};

export default CategoryEditForm;
