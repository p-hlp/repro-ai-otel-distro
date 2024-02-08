import { Schema, model } from "mongoose";

export interface IProduct {
  name: string;
}

export const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
});

export const Product = model<IProduct>("Product", productSchema);
