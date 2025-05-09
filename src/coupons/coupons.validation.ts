import { body, param } from "express-validator";
import categoriesSchema from "./coupons.schema";
import validatorMiddleware from "../middlewares/validator.middleware";

class CouponsValidation {
  createOne = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("discount")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isFloat({ min: 1, max: 100 })
      .withMessage((val, { req }) => req.__("validation_value")),
    body("limit")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("validation_value")),
    body("expireTime")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isDate()
      .withMessage((val, { req }) => req.__("validation_value")),
    validatorMiddleware,
  ];

  updateOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("discount")
      .optional()
      .isFloat({ min: 1, max: 100 })
      .withMessage((val, { req }) => req.__("validation_value")),
    body("limit")
      .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage((val, { req }) => req.__("validation_value")),
    body("expireTime")
      .optional()
      .isDate()
      .withMessage((val, { req }) => req.__("validation_value")),
    validatorMiddleware,
  ];

  getOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  deleteOne = [
    param("id")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
}

const couponsValidation = new CouponsValidation();
export default couponsValidation;
