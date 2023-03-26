import { Request, Response } from "express";
import serverResponses from "../utils/helpers/responses";
import messages from "../config/messages";

export const getBootcamps = (req: Request, res: Response) => {
  let bootcamp = { name: "booty", surname: "campy" };

  serverResponses.sendSuccess(res, messages.SUCCESSFUL, bootcamp);
};
