import express, { Express, Request, Response } from "express";
import serverResponses from "../utils/helpers/responses";
import messages from "../config/messages";

const routes = (app: Express) => {
  const router = express.Router();

  router.get("/", (req: Request, res: Response) => {
    let todo = { key: "value" };
    // Todo.find({}, { __v: 0 })
    //   .then((todos) => {
    //     serverResponses.sendSuccess(res, messages.SUCCESSFUL, todos);
    //   })
    //   .catch((e) => {
    //     serverResponses.sendError(res, messages.BAD_REQUEST, e);
    //   });
    serverResponses.sendSuccess(res, messages.SUCCESSFUL, todo);
  });

  //it's a prefix before api it is useful when you have many modules and you want to
  //differentiate b/w each module you can use this technique
  app.use("/api", router);
};
module.exports = routes;
