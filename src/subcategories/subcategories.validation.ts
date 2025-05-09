import { body, param } from "express-validator";
import validatorMiddleware from "../middlewares/validator.middleware";
import categoriesSchema from "../categories/categories.schema";

class SubcategoriesValidation {
  createOne = [
    body("name")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("category")
      .notEmpty()
      .withMessage((val, { req }) => req.__("validation_field"))
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .custom(async (val: string, { req }) => {
        const category = await categoriesSchema.findById(val);
        if (!category) throw new Error(`${req.__("invalid_id")}`);
        return true;
      }),
    validatorMiddleware,
  ];

  updateOne = [
    param("id").isMongoId().withMessage((val, { req }) => req.__("invalid_id")),
    body("name")
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage((val, { req }) => req.__("validation_length_short")),
    body("category")
      .optional()
      .isMongoId()
      .withMessage((val, { req }) => req.__("invalid_id"))
      .custom(async (val: string, { req }) => {
        const category = await categoriesSchema.findById(val);
        if (!category) throw new Error(`${req.__("invalid_id")}`);
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

const subcategoriesValidation = new SubcategoriesValidation();
export default subcategoriesValidation;
