import { NextFunction, Request, Response } from "express";
import { logger } from "./logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(`${req.method} ${req.url} - ${err.message} - ${err.stack}`);

  res.status(500).json({ error: "Internal Server Error" });
};
