import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "../config/config";
import asyncHandler from "express-async-handler";
import User from "../models/User";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(new Error("Not authorized to access this route"));
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

      req.user = await User.findById(decoded.id);
      next();
    } catch (error) {
      return next(new Error("Not authorized to access this route"));
    }
  }
);
