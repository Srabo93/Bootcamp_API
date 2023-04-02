import express from "express";
import Bottleneck from "bottleneck";
import { getBootcamps } from "../controllers/bootcamps";

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

router.route("/").get(getBootcamps);

export default router;
