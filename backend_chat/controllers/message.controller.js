"use strict";

const { messageModels } = require("../models/index");
const { Types } = require("mongoose");

let controller = {
  list: async (req, res) => {
    try {
      let { recipient_user_id, user_id } = req.query;

      if (recipient_user_id)
        recipient_user_id = new Types.ObjectId(`${recipient_user_id}`);
      if (user_id) user_id = new Types.ObjectId(`${user_id}`);

      let data;
      if (recipient_user_id && user_id) {
        const data_user = await messageModels.find({
          recipient_user_id,
          user_id,
        });

        const data_recipient = await messageModels.find({
          recipient_user_id: user_id,
          user_id: recipient_user_id,
        });

        const result = [...data_user, ...data_recipient];

        data = result.sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });
      } else if (recipient_user_id && !user_id) {
        data = await messageModels.find({ recipient_user_id });
      } else if (user_id && !recipient_user_id) {
        data = await messageModels.find({ user_id });
      } else {
        data = await messageModels.find();
      }

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
  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await messageModels.findById(id);

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
  getByUserId: async (req, res) => {
    try {
      const { user_id } = req.params;

      const data = await messageModels.findOne({ user_id });

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
  getByRecipientId: async (req, res) => {
    try {
      const { recipient_id } = req.params;
      const data = await messageModels.findOne({
        recipient_user_id: recipient_id,
      });

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
      const user_id = req.user_id;
      const { recipient_user_id, message, room_chat_number } = req.body;

      await messageModels.create({
        user_id,
        recipient_user_id,
        room_chat_number,
        message,
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
