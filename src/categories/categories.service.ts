import Categories from "./categories.interface";
import categoriesSchema from "./categories.schema";
import refactorService from "../refactor.service";

class CategoriesService {

  getAll = refactorService.getAll<Categories>(categoriesSchema)
  createOne = refactorService.createOne<Categories>(categoriesSchema)
  getOne = refactorService.getOne<Categories>(categoriesSchema)
  updateOne = refactorService.updateOne<Categories>(categoriesSchema)
  deleteOne = refactorService.deleteOne<Categories>(categoriesSchema)

}

const categoriesService = new CategoriesService();
export default categoriesService;
