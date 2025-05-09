import { body, param } from "express-validator";
import categoriesSchema from "./carts.schema";
import validatorMiddleware from "../middlewares/validator.middleware";

class CartsValidation {

  addToCart = [
    body("product")
    .isMongoId()
    .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  removeFromCart = [
    param("itemId")
    .isMongoId()
    .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  updateToQuantity = [
    param("itemId")
    .isMongoId()
    .withMessage((val, { req }) => req.__("invalid_id")),
    body("quantity")
    .isInt({ min: 1 })
    .withMessage((val, { req }) => req.__("validation_value")),
    validatorMiddleware,
  ];

  
}

const cartsValidation = new CartsValidation();
export default cartsValidation;
