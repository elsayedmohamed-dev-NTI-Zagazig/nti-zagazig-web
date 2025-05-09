import { Router, Request, Response, NextFunction } from "express";
import productsService from "./products.service";
import productsValidation from "./products.validation";
import authService from "../auth/auth.service";
import reviewsRouter from "../reviews/reviews.route";

const productsRoute: Router = Router();

productsRoute.use('/:productId/reviews', reviewsRouter);

productsRoute
  .route("/")
  .get(productsService.getAll)
  .post(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    productsService.uploadImages,
    productsService.saveImage,
    productsValidation.createOne,
    productsService.createOne
  );
productsRoute
  .route("/:id")
  .get(productsValidation.getOne, productsService.getOne)
  .put(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    productsService.uploadImages,
    productsService.saveImage,
    productsValidation.updateOne,
    productsService.updateOne
  )
  .delete(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    productsValidation.deleteOne,
    productsService.deleteOne
  );

export default productsRoute;
