import express from "express";
import path from "path";
import { NODE_ENV } from "./config/config";
import errorHandler from "./middlewares/error";
import connectDb from "./db/index";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

//connection from db here
connectDb();

//routing
import bootcampRoutes from "./routes/bootcamps";
import authRoutes from "./routes/auth";
import reviewRoutes from "./routes/reviews";

const app = express();

if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcampRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is up on port", 3000);
});
