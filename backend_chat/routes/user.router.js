"use strict";

const { userController } = require("../controllers/index");
const libraryMiddleware = require("../libraries/middleware.library");

module.exports = (router) => {
  router.group("/user", libraryMiddleware.jwt_verify, (router) => {
    router.get("/", userController.list);
    router.get("/:id", userController.getById);
    router.post("/create", userController.create);
    router.post("/update", userController.update);
  });
};
