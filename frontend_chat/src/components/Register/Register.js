import React, { useState } from "react";
import "../../assets/css/register.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    repeat_password: "",
  });

  const handleRegister = async () => {
    try {
      if (data.password === data.repeat_password) {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_URL_PORT}/api/auth/register`,
          data
        );
        setData({
          username: "",
          email: "",
          password: "",
          repeat_password: "",
        });
        navigate("/login");
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
    <div className="container-register d-flex justify-content-center bg-success">
      <div className="register-board bg-white">
        <div>
          <h3 className="text-center">Register</h3>
        </div>
        <div className="mt-3">
          <input
            className="form-control"
            placeholder="Username"
            type="text"
            onChange={(e) => onInputChange("username", e.target.value)}
            value={data.username}
          />
        </div>
        <div className="mt-3">
          <input
            className="form-control"
            placeholder="Email"
            type="email"
            onChange={(e) => onInputChange("email", e.target.value)}
            value={data.email}
          />
        </div>
        <div className="mt-3">
          <input
            className="form-control"
            placeholder="Password"
            type="password"
            onChange={(e) => onInputChange("password", e.target.value)}
            value={data.password}
          />
        </div>
        <div className="mt-3">
          <input
            className="form-control"
            placeholder="Repeat password"
            type="password"
            onChange={(e) => onInputChange("repeat_password", e.target.value)}
            value={data.repeat_password}
          />
        </div>
        <div className="mt-3">
          <button
            onClick={handleRegister}
            className="btn bg-success text-white w-100"
          >
            Register
          </button>
        </div>
        <div className="mt-3">
          <p>
            Have an account?
            <Link className="ml-2" to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
