import express, { Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import connectDb from "./db/index";

const app = express();

//connection from db here
connectDb();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//  adding routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(3000, () => {
  console.log("Server is up on port", 3000);
});
