import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import ApiErrors from "../utils/apiErrors";
import refactorService from "../refactor.service";
import Orders from "./orders.interface";
import ordersSchema from "./orders.schema";
import productsSchema from "../products/products.schema";
import usersSchema from "../users/users.schema";
import cartsSchema from "../carts/carts.schema";

class OrdersService {
  // filterOrders => order user
  filterOrders(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    if (req.user.role === "user") filterData.user = req.user._id;
    req.filterData = filterData;
    next();
  }

  getAll = refactorService.getAll<Orders>(ordersSchema);
  getOne = refactorService.getOne<Orders>(ordersSchema);

  // createOrder
  createCashOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const cart = await cartsSchema.findOne({ user: req.user._id });
      if (!cart) return next(new ApiErrors(`your cart is empty`, 404));
      const itemsPrice: number = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;
      const order = await ordersSchema.create({
        items: cart.items,
        taxPrice: cart.taxPrice,
        itemsPrice: itemsPrice,
        totalPrice: cart.taxPrice + itemsPrice,
        user: req.user._id,
        address: req.body.address,
      });
      const bulkOptions = cart.items.map((item) => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
        },
      }));
      await productsSchema.bulkWrite(bulkOptions);
      await cartsSchema.deleteOne({ user: req.user._id });
      res.status(201).json({ data: order });
    }
  );

  // isPaid       {true,false}        الدفع
  payOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isPaid: true,
          paidAt: Date.now(),
        },
        { new: true }
      );
      res.status(200).json({ success: true });
    }
  );

  // deliverOrder  {true,false}       التوصيل
  deliverOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const order = await ordersSchema.findByIdAndUpdate(
        req.params.id,
        {
          isDelivered: true,
          deliveredAt: Date.now(),
        },
        { new: true }
      );
      res.status(200).json({ success: true });
    }
  );



  createOnlineOrder = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string = req.body.obj.payment_key_claims.extra.token;
      const decoded: any = jwt.decode(token);
      const user = await usersSchema.findById(decoded._id);

      const cart: any = await cartsSchema.findOne({ user: user?._id });
      const itemsPrice: number = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;
      const order = await ordersSchema.create({
        items: cart.items,
        taxPrice: cart.taxPrice,
        itemsPrice: itemsPrice,
        totalPrice: cart.taxPrice + itemsPrice,
        user: user?._id,
        address: req.body.obj.payment_key_claims.extra.address,
        isPaid: true,
        paidAt: Date.now(),
      });
      const bulkOptions = cart.items.map((item: any) => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
        },
      }));
      await productsSchema.bulkWrite(bulkOptions);
      await cartsSchema.deleteOne({ user: user?._id });
      res.status(201).json({ data: order });
    }
  );
}

const ordersService = new OrdersService();
export default ordersService;
