import { Document } from "mongoose";
import Users from "../users/users.interface";
import Products from "../products/products.interface";

interface Reviews extends Document {
  readonly comment: string;
  readonly rate: number;
  readonly user: Users;
  readonly product: Products;
  img: string;
}

export default Reviews