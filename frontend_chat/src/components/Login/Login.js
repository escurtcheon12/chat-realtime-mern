import React, { useState } from "react";
import "../../assets/css/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL_PORT}/api/auth/login`,
        data
      );
      setData({
        username: "",
        password: "",
      });

      if (Object.values(result.data.data).length > 0) {
        localStorage.setItem("user_id", result.data.data._id);
        localStorage.setItem("username", result.data.data.username);
        localStorage.setItem("token", result.data.token);

        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onInputChange = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  return (
    <div className="container-login d-flex justify-content-center bg-success">
      <div className="login-board bg-white">
        <div>
          <h3 className="text-center mb-3">Login</h3>
        </div>
        <div className="mt-3">
          <input
            onChange={(e) => onInputChange("username", e.target.value)}
            value={data.username}
            className="form-control"
            placeholder="Username"
            type="text"
          />
        </div>
        <div className="mt-2">
          <input
            onChange={(e) => onInputChange("password", e.target.value)}
            value={data.password}
            className="form-control"
            placeholder="Password"
            type="password"
          />
        </div>
        <div className="mt-2">
          <button
            onClick={handleLogin}
            className="btn bg-success text-white w-100"
          >
            Login
          </button>
        </div>
        <div className="mt-3">
          <p>
            Do not have an account?
            <Link className="ml-2" to="/register">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
