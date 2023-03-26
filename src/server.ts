import express, { Request, Response } from "express";
import path from "path";
import connectDb from "./db/index";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss";
import Bottleneck from "bottleneck";

//connection from db here
connectDb();

//routing
import bootcampRoutes from "./routes/bootcamps";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//  adding routes
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use("/api/v1/bootcamps", bootcampRoutes);

app.listen(3000, () => {
  console.log("Server is up on port", 3000);
});
