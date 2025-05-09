import { Router } from "express";
import usersService from "./users.service";
import usersValidation from "./users.validation";
import authService from "../auth/auth.service";

const usersRouter: Router = Router();

usersRouter.use(
  authService.protectedRoutes,
  authService.checkActive,
  authService.allowedTo("admin")
);

usersRouter
  .route("/")
  .get(usersService.getAll)
  .post(
    usersService.uploadImages,
    usersService.saveImage,
    usersValidation.createOne,
    usersService.createOne
  );

usersRouter
  .route("/:id")
  .get(usersValidation.getOne, usersService.getOne)
  .put(
    usersService.uploadImages,
    usersService.saveImage,
    usersValidation.updateOne,
    usersService.updateOne
  )
  .delete(usersValidation.deleteOne, usersService.deleteOne);

usersRouter.put(
  "/:id/change-password",
  usersValidation.changePassword,
  usersService.changePassword
);

export default usersRouter;
