import { Router } from "express";
import categoriesService from "./orders.service";
import categoriesValidation from "./orders.validation";
import authService from "../auth/auth.service";
import ordersService from "./orders.service";
import ordersValidation from "./orders.validation";

const ordersRouter: Router = Router();

ordersRouter.use(authService.protectedRoutes, authService.checkActive);

ordersRouter
  .route("/")
  .get(ordersService.filterOrders, ordersService.getAll)
  .post(authService.allowedTo("user"), ordersService.createCashOrder);

ordersRouter.get(
  "/:id",
  authService.allowedTo("user"),
  ordersValidation.getOne,
  ordersService.getOne
);

ordersRouter.put(
  "/:id/pay",
  authService.allowedTo("admin", "employee"),
  ordersValidation.payOrder,
  ordersService.payOrder
);

ordersRouter.put(
  "/:id/deliver",
  authService.allowedTo("admin", "employee"),
  ordersValidation.deliverOrder,
  ordersService.deliverOrder
);

export default ordersRouter;
