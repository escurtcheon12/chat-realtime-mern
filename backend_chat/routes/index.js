"use strict";

const express = require("express");
const app = express();
const Router = require("express-group-router");
let router = new Router();
const middleware = require("../libraries/middleware.library");

module.exports = () => {
  router.group("/api", (auth_router) => {
    require("./auth.router")(auth_router);

    router.group("/web", middleware.auth, (core_router) => {
      require("./user.router")(core_router);
      require("./message.router")(core_router);
    });
  });
  

  let listRoutes = router.init();
  app.use(listRoutes);
  return app;
};
