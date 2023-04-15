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
import courseRoutes from "./routes/courses";
import usersRoutes from "./routes/users";

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

/*Multer imports */
import multer from "multer";
import { fileStorage } from "./config/multer";
import { fileFilter } from "./utils/multer";

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.use("/api/v1/bootcamps", upload.single("file"),bootcampRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", usersRoutes);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is up on port", 3000);
});
