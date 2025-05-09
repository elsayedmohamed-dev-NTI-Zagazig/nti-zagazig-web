import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import categoriesSchema from "../categories/categories.schema";
import subcategoriesSchema from "../subcategories/Subcategories.schema";

class ProductsValidation {
  createOne = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_value"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("description")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_value"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("price")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_value"))
      .isFloat({ min: 1, max: 1000000 })
      .withMessage((val, { req }) => req.__("validation_length_long")),
    body("quantity")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage((val, { req }) => req.__("validation_length_long")),
    body("sold").optional(),
    body("discount")
      .optional()
      .isFloat({ min: 1, max: 70 })
      .withMessage((val, { req }) => req.__("validation_length_medium"))
      .custom((val, { req }) => {
        req.body.priceAfterDiscount =
          req.body.price - (req.body.price * val) / 100;
        return true;
      }),
    body("category")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .custom(async (val: string, { req }) => {
        const category = await categoriesSchema.findById(val);
        if (!category) throw new Error(`${req.__("invalid_id")}`);
        return true;
      }),
    body("subcategory")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .custom(async (val: string, { req }) => {
        const subcategory = await subcategoriesSchema.findById(val);
        if (!subcategory) throw new Error(`${req.__("invalid_id")}`);
        if (
          subcategory.category._id!.toString() !== req.body.category.toString()
        )
          throw new Error(`${req.__("invalid_id")}`);
        return true;
      }),
    validatorMiddleware,
  ];

  updateOne = [
    body("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("description")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("price")
      .optional()
      .isFloat({ min: 1, max: 1000000 })
      .withMessage((val, { req }) => req.__("validation_length_long")),
    body("quantity")
      .optional()
      .isInt({ min: 1, max: 10000 })
      .withMessage((val, { req }) => req.__("validation_length_long")),
    body("sold").optional(),
    body("discount")
      .optional()
      .isFloat({ min: 1, max: 70 })
      .withMessage((val, { req }) => req.__("validation_length_medium"))
      .custom((val, { req }) => {
        req.body.priceAfterDiscount =
          req.body.price - (req.body.price * val) / 100;
        return true;
      }),
    body("category")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .custom(async (val: string, { req }) => {
        const category = await categoriesSchema.findById(val);
        if (!category) throw new Error(`${req.__("invalid_id")}`);
        return true;
      }),
    body("subcategory")
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .custom(async (val: string, { req }) => {
        const subcategory = await subcategoriesSchema.findById(val);
        if (!subcategory) throw new Error(`${req.__("invalid_id")}`);
        if (
          subcategory.category._id!.toString() !== req.body.category.toString()
        )
          throw new Error(`${req.__("invalid_id")}`);
        return true;
      }),
    validatorMiddleware,
  ];

  getOne = [
    param("id").isMongoId().withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];

  deleteOne = [
    param("id").isMongoId().withMessage((val, { req }) => req.__("invalid_id")),
    validatorMiddleware,
  ];
}

const productsValidation = new ProductsValidation();
export default productsValidation;
