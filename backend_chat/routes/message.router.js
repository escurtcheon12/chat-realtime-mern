"use strict";

const {messageController} = require('../controllers/index')
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/message", libraryMiddleware.jwt_verify, (router) => {
    router.get("/", messageController.list);
    router.get("/:id", messageController.getById);
    router.get("/user/:user_id", messageController.getByUserId);
    router.get("/recipient/:recipient_id", messageController.getByRecipientId);
    router.post("/create", messageController.create);
  });
};
