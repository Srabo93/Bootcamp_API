import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import serverResponse from "../utils/helpers/responses";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      user: req.user,
    }).catch((reason) => {
      res.json(reason);
    });
    next();
  };
export default validate;
