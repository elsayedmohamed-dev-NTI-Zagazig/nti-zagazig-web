import { Router } from "express";
import categoriesValidation from "./coupons.validation";
import authService from "../auth/auth.service";
import couponsService from "./coupons.service";
import couponsValidation from "./coupons.validation";

const couponsRouter: Router = Router();

couponsRouter.use(
  authService.protectedRoutes,
  authService.checkActive,
  authService.allowedTo("admin", "employee")
);

couponsRouter
  .route("/")
  .get(couponsService.getAll)
  .post(couponsValidation.createOne, couponsService.createOne);

couponsRouter
  .route("/:id")
  .get(categoriesValidation.getOne, couponsService.getOne)
  .put(couponsValidation.updateOne, couponsService.updateOne)
  .delete(couponsService.deleteOne);

export default couponsRouter;
