import { body, param } from "express-validator";
import categoriesSchema from "./orders.schema";
import validatorMiddleware from "../middlewares/validator.middleware";

class OrdersValidation {
  createCashOrder = [
    body("address")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isString(),
    validatorMiddleware,
  ];

  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  payOrder = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  deliverOrder = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
}

const ordersValidation = new OrdersValidation();
export default ordersValidation;
