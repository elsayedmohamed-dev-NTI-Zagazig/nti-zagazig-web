import { Request, Response, NextFunction } from "express";
import Subcategories from "./subcategories.interface";
import refactorService from "../refactor.service";
import subcategoriesSchema from "./Subcategories.schema";

class SubcategoriesService {
  // *** setCategoryId *** //  not body = > request params(url) categoryId
  setCategoryId(req: Request, res: Response, next: NextFunction) {
    if (req.params.categoryId && !req.body.category) {
      req.body.category = req.params.categoryId;
    }
    next();
  }

  // *** filterSubcategories *** //
  filterSubcategories(req: Request, res: Response, next: NextFunction) {
    const filterData: any = {};
    if (req.params.categoryId) {
      filterData.category = req.params.categoryId;
    }
    req.filterData = filterData;
    next();
  }

  getAll = refactorService.getAll<Subcategories>(subcategoriesSchema);
  createOne = refactorService.createOne<Subcategories>(subcategoriesSchema);
  getOne = refactorService.getOne<Subcategories>(subcategoriesSchema);
  updateOne = refactorService.updateOne<Subcategories>(subcategoriesSchema);
  deleteOne = refactorService.deleteOne<Subcategories>(subcategoriesSchema);
}

const subcategoriesService = new SubcategoriesService();
export default subcategoriesService;
