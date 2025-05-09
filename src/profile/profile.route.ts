import { Router } from "express";
import profileService from "./profile.service";
import profileValidation from "./profile.validation";
import authService from "../auth/auth.service";

const profileRouter: Router = Router();

profileRouter.use(authService.protectedRoutes, authService.checkActive);

profileRouter
  .route("/")
  .get(profileService.setUserId, profileService.getOne)
  .put(
    profileService.uploadImages,
    profileService.saveImage,
    profileValidation.updateOne,
    profileService.updateOne
  )

  profileRouter.delete('/:id',
    authService.allowedTo('user'),
    profileValidation.deleteOne,
    profileService.deleteOne
  );

profileRouter.put(
  "/create-password",
  profileValidation.createPassword,
  profileService.createPassword
);


profileRouter.put(
  "/change-password",
  profileValidation.changePassword,
  profileService.changePassword
);

export default profileRouter;
