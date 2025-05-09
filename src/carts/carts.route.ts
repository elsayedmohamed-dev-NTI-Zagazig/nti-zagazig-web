import { Router } from "express";
import cartsService from "./carts.service";
import cartsValidation from "./carts.validation";
import authService from "../auth/auth.service";

const cartsRouter: Router = Router();

cartsRouter.use(
  authService.protectedRoutes,
  authService.checkActive,
  authService.allowedTo("user")
);

cartsRouter
  .route("/")
  .get(cartsService.getCart)
  .post(cartsValidation.addToCart, cartsService.addToCart)
  .delete(cartsService.clearCart);

cartsRouter
  .route("/:itemId")
  .put(cartsValidation.updateToQuantity, cartsService.updateToQuantity)
  .delete(cartsValidation.removeFromCart, cartsService.removeFromCart);

cartsRouter.put("/apply-coupon", cartsService.applyCoupon);


export default cartsRouter;
