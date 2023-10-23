"use strict";

const { userModels } = require("../models/index");
const jwt = require("jsonwebtoken");

let controller = {
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      const [users] = await userModels.find({
        username,
        password,
      });

      const token = jwt.sign({ user_id: users.id }, "user_id");

      return res.json({
        status: "success",
        token,
        data: users,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      await userModels.create({ username, email, password });

      return res.json({
        status: "success",
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
};

module.exports = controller;
