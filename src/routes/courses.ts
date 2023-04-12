import express, { NextFunction, Request, Response } from "express";
import Bottleneck from "bottleneck";
import { authorize, protect } from "../middlewares/auth";
import advancedResults from "../middlewares/advancedResults";
import CourseModel from "../models/Course";
import {
  addCourse,
  deleteCourse,
  getCourse,
  getCourses,
  updateCourse,
} from "../controllers/courses";

const router = express.Router();

const limiter = new Bottleneck({
  maxConcurrent: 10, // Max number of requests to process at once
  minTime: 1000, // Minimum time (in milliseconds) between requests
});

router.use(async (req: Request, res: Response, next: NextFunction) => {
  await limiter.schedule(async () => {
    next();
  });
});

router.route("/").get(
  advancedResults(CourseModel, {
    path: "bootcamp",
    select: "name description",
  }),
  getCourses,
).post(protect, authorize("publisher", "admin"), addCourse);

router.route("/:id").get(getCourse).put(
  protect,
  authorize("publisher", "admin"),
  updateCourse,
).delete(protect, authorize("publisher", "admin"), deleteCourse);

export default router;
