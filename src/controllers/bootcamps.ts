import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import serverResponses from "../utils/helpers/responses";
import messages from "../config/messages";

export const getBootcamps = asyncHandler(
  async (req: Request, res: Response) => {
    let bootcamp = { name: "booty", surname: "campy" };

    serverResponses.sendSuccess(res, messages.SUCCESSFUL, bootcamp);
  }
);
