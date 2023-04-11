import express from "express";
import Bottleneck from "bottleneck";
import { authorize, protect } from "../middlewares/auth";
import {
  addReview,
  deleteReview,
  getReview,
  getReviews,
  updateReview,
} from "../controllers/reviews";
import ReviewModel from "../models/Review";
import advancedResults from "../middlewares/advancedResults";

const router = express.Router();

const limiter = new Bottleneck({
  maxConcurrent: 10, // Max number of requests to process at once
  minTime: 1000, // Minimum time (in milliseconds) between requests
});

router.use(async (req, res, next) => {
  await limiter.schedule(async () => {
    next();
  });
});

router
  .route("/")
  .get(
    advancedResults(ReviewModel, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);

router
  .route("/:id")
  .get(getReview)
  .put(protect, authorize("user", "admin"), updateReview)
  .delete(protect, authorize("user", "admin"), deleteReview);

export default router;
