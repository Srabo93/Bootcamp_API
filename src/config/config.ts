import * as dotenv from "dotenv";
import fs from "fs";

if (fs.existsSync(`${__dirname}/.env`)) {
  console.log("Using .env file to supply config environment variables");
  dotenv.config({ path: `${__dirname}/.env` });
} else {
  console.log("Using .env.example file to supply config environment variables");
  dotenv.config({ path: `${__dirname}/.env` });
}

export const MONGODB_URI = process.env.MONGODB_URI as string;
export const GEOCODER_API_KEY = process.env.GEOCODER_API_KEY as string;
export const JWT_EXPIRE = process.env.JWT_EXPIRE as string;
export const JWT_SECRET = process.env.JWT_SECRET as string;

if (!MONGODB_URI) {
  console.log("No client secret. Set MONGODB_URI environment variable.");
  process.exit(1);
}

if (!GEOCODER_API_KEY) {
  console.log("No client secret. Set GEOCODER_API_KEY environment variable.");
  process.exit(1);
}

if (!JWT_EXPIRE) {
  console.log("No client secret. Set JWT_EXPIRE environment variable.");
  process.exit(1);
}

if (!JWT_SECRET) {
  console.log("No client secret. Set JWT_SECRET environment variable.");
  process.exit(1);
}
