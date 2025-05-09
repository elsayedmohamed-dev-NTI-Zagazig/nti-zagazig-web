import { Router } from "express";
import authService from "../auth/auth.service";
import addressService from "./address.service";

const addressRouter: Router = Router();

addressRouter.use(authService.protectedRoutes, authService.checkActive);

addressRouter
  .route("/")
  .get(addressService.getAddress)
  .post(addressService.addAddress);

  addressRouter.delete("/:addressId", addressService.removeAddress);

export default addressRouter;
