import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import refactorService from "../refactor.service";
import Users from "./users.interface";
import usersSchema from "./users.schema";
import ApiErrors from "../utils/apiErrors";
import { uploadSingleFile } from "../middlewares/uploadFiles.middlewares";

class UsersService {
  getAll = refactorService.getAll<Users>(usersSchema);
  createOne = refactorService.createOne<Users>(usersSchema);
  getOne = refactorService.getOne<Users>(usersSchema);
  deleteOne = refactorService.deleteOne<Users>(usersSchema);
  // updateOne = refactorService.updateOne<Users>(usersSchema)

  updateOne = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          image: req.body.image,
          active: req.body.active,
        },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res.status(200).json({ data: user });
    }
  );

  changePassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findByIdAndUpdate(
        req.params.id,
        {
          name: req.body.name,
          password: bcrypt.hash(req.body.password, 13),
          passwordChangedAt: Date.now(),
        },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 400));
      res.status(200).json({ data: user });
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

const usersService = new UsersService();
export default usersService;
