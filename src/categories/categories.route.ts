import { Router } from "express";
import categoriesService from "./categories.service";
import subcategoriesRouter from "../subcategories/subcategories.route";
import categoriesValidation from "./categories.validation";
import authService from "../auth/auth.service";

const categoriesRouter: Router = Router();

// /api/v1/categories/categoryId                ====>   categories
// /api/v1/categories/categoryId/subcategories  ====>   subcategories

categoriesRouter.use("/:categoryId/subcategories", subcategoriesRouter);

categoriesRouter.route("/")
.get(categoriesService.getAll)
.post(
  authService.protectedRoutes,
  authService.checkActive,
  authService.allowedTo("admin", "employee"),
  categoriesValidation.createOne,
  categoriesService.createOne
);

categoriesRouter
  .route("/:id")
  .get(categoriesValidation.getOne, categoriesService.getOne)
  .put(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    categoriesValidation.updateOne,
    categoriesService.updateOne
  )
  .delete(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("admin", "employee"),
    categoriesValidation.deleteOne,
    categoriesService.deleteOne
  );
export default categoriesRouter;
