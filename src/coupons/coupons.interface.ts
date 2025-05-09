import { Document } from "mongoose";

interface Coupons extends Document {
  readonly name: string;
  readonly discount: number;
  readonly expireTime: Date;
  readonly limit: number;
  img: string;
}

export default Coupons;
