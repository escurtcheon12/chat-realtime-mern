import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login, Menu } from "../../components";
import Register from "../../components/Register/Register";

const Routers = () => {
  useEffect(() => {
    if (
      localStorage.getItem("user_id") == "" &&
      localStorage.getItem("user_id") == null
    ) {
      window.location = "http://localhost:3000/login";
    }
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
};

export default Routers;
