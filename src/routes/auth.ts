import express from "express";
import Bottleneck from "bottleneck";
import {
  register,
  login,
  logout,
  currentUser,
  updateDetails,
  forgotPassword,
  resetPassword,
  updatePassword,
} from "../controllers/auth";
import { protect } from "../middlewares/auth";

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

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, currentUser);
router.put("/updatedetails", protect, updateDetails);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/updatepassword", protect, updatePassword);

export default router;
