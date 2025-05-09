import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import refactorService from "../refactor.service";
import Users from "../users/users.interface";
import usersSchema from "../users/users.schema";
import ApiErrors from "../utils/apiErrors";
import { uploadSingleFile } from "../middlewares/uploadFiles.middlewares";
import createTokens from "../utils/tokens";

class ProfileService {

  // profile  user => login 
  setUserId = (req: Request, res: Response, next: NextFunction) => {
    req.params.id = req.user?._id;
    next();
  };

  // *************************** //
  getOne = refactorService.getOne<Users>(usersSchema);          // setUserID
  deleteOne = refactorService.deleteOne<Users>(usersSchema);   // allowedTo("user")

  // *************************** //

  updateOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          image: req.body.image,
        },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ data: user });
    }
  );

  // If you enter email =>(Google) 
  createPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findOneAndUpdate(
        { _id: req.user._id, hasPassword: false },
        { password: await bcrypt.hash(req.body.password, 13) },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(200).json({ data: user });
    }
  );

  changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        {
          name: req.body.name,
          password: await bcrypt.hash(req.body.password, 13),
        },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      const token = createTokens.accessToken(user._id, user.role);
      res.status(200).json({ token, data: user });
    }
  );

  // image
  uploadImages = uploadSingleFile(["image"], "image");
  saveImage = async (req: Request, res: Response, next: NextFunction) => {
    if (req.file) {
      const fileName: string = `user-${Date.now()}-image.webp`;
      await sharp(req.file.buffer)
        .resize(1200, 1200)
        .webp({ quality: 95 })
        .toFile(`uploads/images/users/${fileName}`);
      req.body.image = fileName;
    }
    next();
  };
}

const profileService = new ProfileService();
export default profileService;
