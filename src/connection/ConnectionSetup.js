import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import LoginContext from "../store/LoginContext";

let token = localStorage.getItem("token");
const expiredTime = localStorage.getItem("expiredTime");

const Logout = () => {
  const loginCtx = useContext(LoginContext);
  loginCtx.logoutHander();
};

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error") {
    toast.error("Network error - Make sure your API server is up and running");
  } else if (error.response.status == 403) {
    toast.error("Out of session");
    localStorage.clear();
    window.location.href = "/login";
  } else if (error.response.status == 401) {
    toast.error("Please login");
    localStorage.clear();
    window.location.href = "/login";
  }
  return Promise.reject(error);
});

axios.defaults.headers = { Authorization: "Bearer " + token };

export const API_URL = "https://localhost:7068/api";
export const setToken = () => {
  token = localStorage.getItem("token");
  console.log(token);
  axios.defaults.headers = { Authorization: "Bearer " + token };
};
