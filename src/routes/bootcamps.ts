import express from "express";
import { getBootcamps } from "../controllers/bootcamps";

const router = express.Router();

router.route("/").get(getBootcamps);

export default router;
