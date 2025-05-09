import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import usersSchema from "../users/users.schema";
import createTokens from "../utils/tokens";
import ApiErrors from "../utils/apiErrors";
import sendEmail from "../utils/sendMail";

class AuthService {
  // signup
  signup = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.create({
        username: req.body.username,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        image: req.body.image,
      });

      const token = createTokens.accessToken(user._id, user.role);
      res.status(201).json({ token, data: user });
    }
  );

  // login
  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
      });

      if (
        !user ||
        user.hasPassword == false ||
        !(await bcrypt.compare(req.body.password, user.password))
      ) {
        return next(new ApiErrors(`${req.__("invalid_login")}`, 400));
      }
      const token = createTokens.accessToken(user._id, user.role);
      res.status(201).json({ token, data: user });
    }
  );

  // adminLogin
  adminLogin = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user = await usersSchema.findOne({
        $or: [{ username: req.body.username }, { email: req.body.email }],
        role: { $in: ["admin", "employee"] },
      });

      if (
        !user ||
        user.hasPassword == false ||
        !(await bcrypt.compare(req.body.password, user.password))
      ) {
        return next(new ApiErrors(`${req.__("invalid_login")}`, 400));
      }
      const token = createTokens.accessToken(user._id, user.role);
      res.status(201).json({ token, data: user });
    }
  );

  //forget Password
  forgetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- check user found or not found
      const user: any = await usersSchema.findOne({ email: req.body.email });
      if (!user) return next(new ApiErrors(`${req.__("check_email")}`, 404));
      // 2- ResetCode
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      // 3- hash ResetCode
      const bcryptCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");
      const message = `Your reset code is : ${resetCode}`;
      const options = {
        message,
        email: user.email,
        subject: "Reset Password",
      };

      try {
        await sendEmail(options);
        user.passwordResetCode = bcryptCode;
        user.passwordResetCodeExpires = Date.now() + 10 * 60 * 1000;
        user.passwordResetCodeVerify = false;
        if (user.image && user.image.startsWith(`${process.env.BASE_URL}`))
          user.image = user.image.split("/").pop();
        await user.save({ validateModifiedOnly: true });
      } catch (error) {
        console.log(error);
        return next(new ApiErrors(`${req.__("send_email")}`, 500));
      }
      const token = createTokens.resetToken(user._id);
      res.status(200).json({ token, success: true });
    }
  );

  //verify Code
  verifyResetCode = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string = "";
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else return next(new ApiErrors(`${req.__("check_verify_code")}`, 403));

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_RESET!);
      const hashedResetCode: string = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");
      const user: any = await usersSchema.findOne({
        _id: decoded._id,
        passwordResetCode: hashedResetCode,
        passwordResetCodeExpires: { $gt: Date.now() },
      });
      if (!user)
        return next(new ApiErrors(`${req.__("check_code_valid")}`, 403));

      user.passwordResetCodeVerify = true;
      if (user.image && user.image.startsWith(`${process.env.BASE_URL}`))
        user.image = user.image.split("/").pop();
      await user.save({ validateModifiedOnly: true });

      res.status(200).json({ token, success: true });
    }
  );

  // reset Code
  resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string = "";
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else return next(new ApiErrors(`${req.__("check_reset_code")}`, 403));

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET_RESET!);
      const user: any = await usersSchema.findOne({
        _id: decoded._id,
        passwordResetCodeVerify: true,
      });
      if (!user)
        return next(new ApiErrors(`${req.__("check_code_verify")}`, 403));

      user.password = req.body.password;
      user.passwordResetCodeExpires = undefined;
      user.passwordResetCode = undefined;
      user.passwordResetCodeVerify = undefined;
      user.passwordChangedAt = Date.now();

      if (user.image && user.image.startsWith(`${process.env.BASE_URL}`))
        user.image = user.image.split("/").pop();
      await user.save({ validateModifiedOnly: true });

      res.status(200).json({ success: true });
    }
  );

  protectedRoutes = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      //  1- check token
      let token: string = "";
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
      )
        token = req.headers.authorization.split(" ")[1];
      else return next(new ApiErrors(`${req.__("check_login")}`, 401));

      //  2- verify token
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

      //  3- check user find token
      const user = await usersSchema.findById(decoded._id);
      if (!user) return next(new ApiErrors(`${req.__("check_login")}`, 401));

      //  4- Check User Edit Password
      if (user.passwordChangedAt instanceof Date) {
        const changedPasswordTime: number = Math.trunc(
          user.passwordChangedAt.getTime() / 1000
        );
        if (changedPasswordTime > decoded.iat)
          return next(
            new ApiErrors(`${req.__("check_password_changed")}`, 401)
          );
      }

      req.user = user;
      next();
    }
  );

  // checkActive         active = boolean => (true,false)
  checkActive = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user?.active)
        return next(new ApiErrors(`${req.__("check_active")}`, 403));
      next();
    }
  );

  // allowedTo          roles => ['admin','employee','user']
  allowedTo = (...roles: string[]) =>
    asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      // => route ['admin','employee']
      if (!roles.includes(req.user.role))
        return next(new ApiErrors(`${req.__("allowed_to")}`, 403));
      next();
    });
}

const authService = new AuthService();
export default authService;
