import dotenv from "dotenv";
dotenv.config();

import { intializeTelemetry } from "./telemetry";
// Initialize telemetry before instrumented modules are imported
intializeTelemetry();

import cors from "cors";
import express, { Express, NextFunction, Request, Response } from "express";
import { ObjectId } from "mongodb";
import { connect } from "mongoose";
import { errorHandler } from "./errorHandler";
import { IProduct, Product } from "./product";

const startServer = async () => {
  const app: Express = express();
  const port = process.env.PORT || 8080;

  const mongoUrl = process.env.MONGO_URL || "";

  app.use(express.json());
  app.use(cors());

  await connect(mongoUrl);

  app.get(
    "/products",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = Product.find();
        const products = await query.exec();
        const response = products.map((product) => {
          return {
            id: product._id,
            name: product.name,
          };
        });
        res.status(200).send(response);
      } catch (err) {
        next(err);
      }
    }
  );

  app.post(
    "/products",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const product = req.body as IProduct;
        const newProduct = new Product(product);
        const result = await newProduct.save();
        res.status(201).json(result._id);
      } catch (err) {
        next(err);
      }
    }
  );

  app.delete(
    "/products/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = req.params.id;
        // remove last character of id and replace with '1' to simulate a valid ObjectId, id is a 24 character hex string
        const query = Product.deleteOne({ _id: new ObjectId("1234") });
        res.status(204).send();
      } catch (err) {
        next(err);
      }
    }
  );

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
