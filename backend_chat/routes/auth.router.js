"use strict";

const { authController } = require("../controllers/index");

module.exports = (router) => {
  router.group("/auth", (router) => {
    router.post("/login", authController.login);
    router.post("/register", authController.register);
  });
};
