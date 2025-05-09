import { Request, Response, NextFunction } from "express";
import ApiErrors from "../utils/apiErrors";

const devErrors = (error: any, res: Response) => {
  res.status(error.statusCode!).json({
    error: error,
    status: error.status,
    message: error.message,
    stack: error.stack,
  });
};

const prodErrors = (error: any, res: Response) => {
  res.status(error.statusCode!).json({
    status: error.status,
    message: error.message,
  });
};

// handle error token (expired , NotFound)
const handleJwtExpired = (message: string, res: Response) =>
  new ApiErrors(message, 401);

const globalErrors = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "Error";
  //  handle error token (expired , NotFound)
  if (error.name == "TokenExpiredError" || error.name == "JsonWebTokenError") {
    error = handleJwtExpired(`${req.__("session_expired")}`, res);
  }
  if (process.env.NODE_ENV === "development") {
    devErrors(error, res);
  } else {
    prodErrors(error, res);
  }
};

export default globalErrors;
