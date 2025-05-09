import { Document } from "mongoose";
import Categories from "../categories/categories.interface";

interface Subcategories extends Document {
  readonly name: string;
  readonly description: string;
  readonly category: Categories;
  img: string;
}

export default Subcategories;