import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { API_URL, setToken } from "../connection/ConnectionSetup";

const LoginContext = React.createContext({
  isLoggedIn: true,
  loginHandler: () => {},
  logoutHander: (username, password) => {},
  setState: (state) => {},
});

export const LoginContextProvider = (props) => {
  const [inLoggedIn, setIsLoggedIn] = useState(false);

  const navigator = useNavigate();

  const onLoginHandler = (username, password) => {
    axios
      .post(API_URL + "/Users/login", {
        username: username,
        password: password,
      })
      .then(
        (res) => {
          localStorage.setItem("token", res.data.tokenString);
          localStorage.setItem("expiredTime", res.data.expiration);
          setIsLoggedIn(true);
          setToken();
          navigator("/main/dashboard");
        },
        () => {
          toast.error("Check your username and password");
        }
      );
  };

  const onLogoutHandler = () => {
    localStorage.clear();
    setIsLoggedIn(false);
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn: inLoggedIn,
        loginHandler: onLoginHandler,
        logoutHander: onLogoutHandler,
        setState: setIsLoggedIn,
      }}
    >
      {props.children}
    </LoginContext.Provider>
  );
};

export default LoginContext;
