import { Document } from "mongoose";

interface Categories extends Document {
  readonly name: string;
  img: string;
}

export default Categories