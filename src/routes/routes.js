const express = require("express");
const AuthRoutes = require("../modules/auth/auth.routes");
const UserRoutes = require("../modules/user/user.routes");
const ProductRoutes = require("../modules/products/product.routes");
const OrderRoutes = require("../modules/orders/order.routes");
const DashboardRoutes = require("../modules/dashboard/dashboard.routes");

const router = express.Router();

const routes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
];

routes.forEach((route) => router.use(route.path, route.route));

module.exports = router;
