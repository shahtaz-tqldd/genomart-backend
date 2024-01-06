const express = require("express");
const AuthRoutes = require("../modules/auth/auth.routes");
const UserRoutes = require("../modules/user/user.routes");

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  // {
  //   path: "/products",
  //   route: ProductRoutes,
  // },
  // {
  //   path: "/orders",
  //   route: OrderRoutes,
  // },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
