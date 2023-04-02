import express from "express";
import Bottleneck from "bottleneck";
import {
  getBootcamps,
  createBootcamp,
  getBootcamp,
  updateBootcamp,
  deleteBootcamp,
  bootcampPhotoUpload,
  getBootcampsInRadius,
} from "../controllers/bootcamps";

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

router.route("/").get(getBootcamps).post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

router.route("/:id/photo").put(bootcampPhotoUpload);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

export default router;
