import express, { NextFunction, Request, Response } from "express";
import Bottleneck from "bottleneck";
import BootcampModel from "../models/Bootcamp";
import {
  bootcampPhotoUpload,
  createBootcamp,
  deleteBootcamp,
  getBootcamp,
  getBootcamps,
  getBootcampsInRadius,
  updateBootcamp,
} from "../controllers/bootcamps";
import { authorize, protect } from "../middlewares/auth";
import advancedResults from "../middlewares/advancedResults";
/*Include other resources for re-routing*/
import coursesRouter from "./courses";
import reviewsRouter from "./reviews";

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

/* Re-route into other resource */
router.use("/:bootcampId/courses", coursesRouter);
router.use("/:bootcampId/reviews", reviewsRouter);

router
  .route("/")
  .get(advancedResults(BootcampModel, "courses"), getBootcamps)
  .post(protect, authorize("publisher", "admin"), createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize("publisher", "admin"), updateBootcamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootcamp);

router
  .route("/:id/photo")
  .put(
    protect,
    authorize("publisher", "admin"),
    bootcampPhotoUpload,
  ), router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

export default router;
