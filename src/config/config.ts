import * as dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync("../../.env")) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: "../../.env" });
} else {
  console.log("Using .env.example file to supply config environment variables");
  dotenv.config({ path: "../../.env" }); // you can delete this after you create your own .env file!
}

export const MONGODB_URI = "mongodb://mongo:27017/Bootcamp" as string;

if (!MONGODB_URI) {
  console.log("No client secret. Set MONGODB_URI environment variable.");
  process.exit(1);
}
