import React, { useContext, useRef, useState } from "react";
import { Card, Form, Row, Col, Container, Button } from "react-bootstrap";

import classes from "./LoginPage.module.css";

import nashlogo from "../assets/nashlogo.png";
import LoginContext from "../store/LoginContext";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

const LoginPage = () => {
  const loginCtx = useContext(LoginContext);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm();

  const loginUsernameRef = useRef();
  const loginPasswordRef = useRef();

  const ShowLoginForm = () => {
    const blocker = document.getElementById("blocker");
    blocker.classList.toggle(classes.signup);
  };

  const ShowSignUpForm = () => {
    const blocker = document.getElementById("blocker");
    blocker.classList.toggle(classes.signup);
  };

  const signUpHandler = (data) => {
    if (data.signinPassword != data.signinConfirmPassword) {
      toast.error("Your password is not match your confirm password");
      return;
    } else {
    }
  };

  return (
    <>
      <ToastContainer />
      <Row className="justify-content-center align-items-center mt-5">
        <Card as={Col} lg="8">
          <Card.Body
            style={{ position: "relative", overflow: "hidden" }}
            as={Row}
          >
            <div id="blocker" className={classes.modal}></div>
            <Col>
              <Form onSubmit={handleSubmit(signUpHandler)}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("signupUsername")}
                    placeholder="Enter username"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("signupEmail")}
                    placeholder="Enter email"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    {...register("signupPassword")}
                    placeholder="Enter password"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    {...register("signupConfirmPassword")}
                  />
                </Form.Group>
                <Form.Group>
                  <Button type="submit" variant="success">
                    Sign up
                  </Button>{" "}
                  <p className="text-muted small">
                    Already have account?{" "}
                    <span
                      onClick={() => {
                        ShowLoginForm();
                      }}
                      style={{ color: "blue", cursor: "pointer" }}
                    >
                      Sign in
                    </span>
                  </p>
                </Form.Group>
              </Form>
            </Col>

            <Col>
              <Form
                className="align-items-center"
                onSubmit={handleSubmit((d) =>
                  loginCtx.loginHandler(d.loginUsername, d.loginPassword)
                )}
              >
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    {...register("loginUsername")}
                    type="text"
                    placeholder="Enter Username"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    {...register("loginPassword")}
                    type="password"
                    placeholder="Enter Password"
                  />
                </Form.Group>
                <Form.Group>
                  <Button type="submit" variant="primary">
                    Sign in
                  </Button>{" "}
                  <p className="text-muted small">
                    Don't have account yet?{" "}
                    <span
                      onClick={() => {
                        ShowSignUpForm();
                      }}
                      style={{ color: "blue", cursor: "pointer" }}
                    >
                      Sign up
                    </span>
                  </p>
                </Form.Group>
              </Form>
            </Col>
          </Card.Body>
        </Card>
      </Row>
    </>
  );
};

export default LoginPage;
