import dotenv from "dotenv";
dotenv.config();

import { intializeTelemetry } from "./telemetry";
// Initialize telemetry before instrumented modules are imported
intializeTelemetry();

import cors from "cors";
import express, { Express, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { connect } from "mongoose";
import { IProduct, Product } from "./product";

const startServer = async () => {
  const app: Express = express();
  const port = process.env.PORT || 8080;

  const mongoUrl = process.env.MONGO_URL || "";

  app.use(express.json());
  app.use(cors());

  await connect(mongoUrl);

  app.get("/products", async (req: Request, res: Response) => {
    const query = Product.find();
    const products = await query.exec();
    const response = products.map((product) => {
      return {
        id: product._id,
        name: product.name,
      };
    });
    res.status(200).send(response);
  });

  app.post("/products", async (req: Request, res: Response) => {
    const product = req.body as IProduct;
    const newProduct = new Product(product);
    const result = await newProduct.save();
    res.status(201).json(result._id);
  });

  app.delete("/products/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const query = Product.deleteOne({ _id: new ObjectId(id) });
    await query.exec();
    res.status(204).send();
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
