import { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import cartsSchema from "./carts.schema";
import ApiErrors from "../utils/apiErrors";
import productsSchema from "../products/products.schema";
import Carts, { CartItems } from "./carts.interface";
import couponsSchema from "../coupons/coupons.schema";

class CartsService {
  // addToCart
  addToCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // 1- find product  => Database
      const product = await productsSchema.findById(req.body.product);
      if (!product) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      // 2- user = cartsSchema
      let cart: any = await cartsSchema.findOne({ user: req.user._id });
      if (!cart) {
        // 3- create cart
        cart = await cartsSchema.create({
          user: req.user._id,
          items: {
            product: product._id,
            price: product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.price,
          },
        });
      } else {
        // 4- product found cart or no cart
        const productIndex = cart.items.findIndex((item: CartItems) => {
          item.product._id!.toString() === product._id!.toString();
        });
        if (productIndex > -1) {
          cart.items[productIndex].quantity += 1;
        } else {
          cart.items.push({
            product: product._id,
            price: product.priceAfterDiscount
              ? product.priceAfterDiscount
              : product.price,
          });
        }
      }
      this.calcTotalPrice(cart);
      await cart.save();
      res.status(200).json({ length: cart.items.length, data: cart });
    }
  );

  // remove from cart
  removeFromCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOneAndUpdate(
        { user: req.user._id },
        {
          $pull: { items: { _id: req.params.itemId } },
        },
        { new: true }
      );
      if (!cart) return next(new ApiErrors(`your cart is empty`, 404));
      this.calcTotalPrice(cart);
      await cart.save();
      res.status(200).json({ length: cart.items.length, data: cart });
    }
  );

  // update quantity
  updateToQuantity = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user._id });
      if (!cart) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      const productIndex = cart.items.findIndex(
        (item: CartItems) =>
          item._id!.toString() === req.params.itemId.toString()
      );
      if (productIndex > -1) {
        cart.items[productIndex].quantity = req.body.quantity;
      } else {
        return next(new ApiErrors(`${req.__("not_found")}`, 404));
      }
      this.calcTotalPrice(cart);
      await cart.save();
      res.status(200).json({ length: cart.items.length, data: cart });
    }
  );

  //  apply coupons
  applyCoupon = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const coupon = await couponsSchema.findOne({
        name: req.body.coupon,
        expireTime: { $gt: Date.now() },
      });
      if (!coupon) return next(new ApiErrors(`${req.__("not_found")}`, 404));
      const cart = await cartsSchema.findOne({ user: req.user._id });
      if (!cart) return next(new ApiErrors(`your cart is empty`, 404));
      const totalPriceAfterDiscount: any = (
        cart.totalPrice -
        cart.totalPrice * (coupon.discount / 100)
      ).toFixed(2);
      cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
      cart.taxPrice = totalPriceAfterDiscount * 0.05;
      await cart.save();
      res.status(200).json({ length: cart.items.length, data: cart });
    }
  );


  // calcTotalPrice
  calcTotalPrice(cart: Carts) {
    let totalPrice: number = 0;
    cart.items.forEach((item: CartItems) => {
      totalPrice += item.price * item.quantity;
    });
    cart.totalPrice = totalPrice;
    cart.taxPrice = totalPrice * 0.05;
    cart.totalPriceAfterDiscount = undefined;
  }

  // getCart
  getCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user._id });
      if (!cart) return next(new ApiErrors(`your cart is empty`, 404));
      res.status(200).json({ data: cart });
    }
  );

  // clearCart
  clearCart = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOneAndDelete({ user: req.user._id });
      if (!cart) return next(new ApiErrors(`your cart is empty`, 404));
      res.status(204).json({});
    }
  );
}

const cartsService = new CartsService();
export default cartsService;
