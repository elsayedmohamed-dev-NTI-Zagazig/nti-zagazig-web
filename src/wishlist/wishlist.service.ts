import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import usersSchema from "../users/users.schema";
import Users from "../users/users.interface";
import ApiErrors from "../utils/apiErrors";

class WishlistService {
  getWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema
        .findById(req.user._id)
        .populate("wishlist");
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      res
        .status(200)
        .json({ length: user.wishlist.length, data: user.wishlist });
    }
  );
  addToWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { wishlist: req.body.productId } },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      await user.populate("wishlist");
      res
        .status(200)
        .json({ length: user.wishlist.length, data: user.wishlist });
    }
  );
  removeFromWishlist = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const user: Users | null = await usersSchema.findByIdAndUpdate(
        req.user._id,
        { $pull: { wishlist: req.params.productId } },
        { new: true }
      );
      if (!user) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      await user.populate("wishlist");
      res
        .status(200)
        .json({ length: user.wishlist.length, data: user.wishlist });
    }
  );
}

const wishlistService = new WishlistService();
export default wishlistService;
