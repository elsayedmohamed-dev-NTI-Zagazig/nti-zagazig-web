import { Application, Request, Response, NextFunction } from "express";
import csurf from "csurf";
import categoriesRouter from "./categories/categories.route";
import subcategoriesRouter from "./subcategories/subcategories.route";
import globalErrors from "./middlewares/globalErrors.middleware";
import ApiErrors from "./utils/apiErrors";
import productsRoute from "./products/products.route";
import usersRouter from "./users/users.route";
import authRouter from "./auth/auth.route";
import profileRouter from "./profile/profile.route";
import googleRoute from "./google/google.route";
import wishlistRouter from "./wishlist/wishlist.route";
import addressRouter from "./address/address.route";
import reviewsRouter from "./reviews/reviews.route";
import couponsRouter from "./coupons/coupons.route";
import cartsRouter from "./carts/carts.route";
import ordersRouter from "./orders/orders.route";
import verifyPaymob from "./middlewares/verifyPaymob.middleware";
import paymentRouter from "./orders/payment.route";

declare module "express" {
  interface Request {
    filterData?: any;
    files?: any;
    user?: any;
  }
}

const mountRoutes = (app: Application) => {

  // ****************************   payment  ***************
  app.post(
    "/paymob-webhook",
    verifyPaymob,
    (req: Request, res: Response, next: NextFunction) => {
      if (req.body.obj.success === true) {
        // res.redirect(307, `/api/v1/${req.body.obj.payment_key_claims.extra.routeName}`);
        res.redirect(307, `/api/v1/payment`);
      } else {
        return next(new ApiErrors("invalid payment", 403));
      }
    }
  );
  app.use("/api/v1/payment", paymentRouter);
  // *********************************************************
  app.use("/auth/google", googleRoute);
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      },
    })
  );
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.cookie("cookies", req.csrfToken());
    next();
  });
  app.use("/api/v1/categories", categoriesRouter);
  app.use("/api/v1/subcategories", subcategoriesRouter);
  app.use("/api/v1/products", productsRoute);
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/users", usersRouter);
  app.use("/api/v1/profile", profileRouter);
  app.use("/api/v1/wishlist", wishlistRouter);
  app.use("/api/v1/address", addressRouter);
  app.use("/api/v1/reviews", reviewsRouter);
  app.use("/api/v1/coupons", couponsRouter);
  app.use("/api/v1/carts", cartsRouter);
  app.use("/api/v1/orders", ordersRouter);

  //  Handle Error Route
  app.all("*", (req: Request, res: Response, next: NextFunction) => {
    next(new ApiErrors(`Route ${req.originalUrl} Not Found`, 400));
  });
  app.use(globalErrors);
};

export default mountRoutes;
