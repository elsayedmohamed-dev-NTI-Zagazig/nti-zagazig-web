import { Router } from "express";
import authService from "../auth/auth.service";
import reviewsService from "./reviews.service";
import reviewsValidation from "./reviews.validation";

const reviewsRouter: Router = Router({ mergeParams: true });

reviewsRouter
  .route("/")
  .get(reviewsService.filterReviews, reviewsService.getAll)
  .post(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("user"),
    reviewsService.setIds,
    reviewsValidation.createOne,
    reviewsService.createOne
  );

reviewsRouter.get(
  "/my",
  authService.protectedRoutes,
  authService.checkActive,
  authService.allowedTo("user"),
  reviewsService.filterReviews,
  reviewsService.getAll
);

reviewsRouter
  .route("/:id")
  .get(reviewsValidation.getOne, reviewsService.getOne)
  .put(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("user"),
    reviewsValidation.updateOne,
    reviewsService.updateOne
  )
  .delete(
    authService.protectedRoutes,
    authService.checkActive,
    authService.allowedTo("user", "admin", "employee"),
    reviewsValidation.deleteOne,
    reviewsService.deleteOne
  );
export default reviewsRouter;
