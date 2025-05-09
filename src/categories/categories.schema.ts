import mongoose from "mongoose";
import Categories from "./categories.interface";

const categoriesSchema = new mongoose.Schema<Categories>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    img: { type: String },
  },
  {
    timestamps: true,
  }
);



export default mongoose.model<Categories>("categories" ,categoriesSchema );
