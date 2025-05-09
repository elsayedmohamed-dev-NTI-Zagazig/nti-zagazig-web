import { Router } from "express";
import authValidation from "./auth.validation";
import authService from "./auth.service";

const authRouter: Router = Router();

authRouter.post("/signup", authValidation.signup, authService.signup);
authRouter.post("/login", authValidation.login, authService.login);
authRouter.post("/admin-login", authValidation.login, authService.adminLogin);
authRouter.post("/forget-password", authValidation.forgetPassword, authService.forgetPassword);
authRouter.post("/verify-password", authService.verifyResetCode);
authRouter.post('/reset-password', authValidation.changePassword, authService.resetPassword);

export default authRouter;
