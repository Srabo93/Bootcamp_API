import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();
if (fs.existsSync(__dirname + "../.env")) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: __dirname + "../.env" });
} else {
  console.log("Using .env.example file to supply config environment variables");
  dotenv.config({ path: ".env.example" }); // you can delete this after you create your own .env file!
}
if (fs.existsSync(__dirname + "../test.txt")) {
  console.log("ja gibts");
}
export const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.log("No client secret. Set MONGODB_URI environment variable.");
  process.exit(1);
}
