"use strict";

const { userModels } = require("../models/index");

let controller = {
  list: async (req, res) => {
    try {
      const data = await userModels.find();

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  create: async (req, res) => {
    try {
      const data = req.body;

      await userModels.create(data);

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
  getById: async (req, res) => {
    try {
      const { id } = req.params;

      const data = await userModels.findById(id);

      return res.json({
        status: "success",
        data,
      });
    } catch (err) {
      return res.status(500).json({
        status: "failed",
        message: err.message,
      });
    }
  },
  update: async (req, res) => {
    try {
      const { user_id, username } = req.body;

      const data = await userModels.findByIdAndUpdate(user_id, {
        username,
        lastseenAt: new Date(),
      });

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
