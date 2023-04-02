import * as fs from "fs";
import { ConnectOptions, connect } from "mongoose";
import { MONGODB_URI } from "./config/config";
import BootcampModel from "./models/Bootcamp";
import CourseModel from "./models/Course";
import UserModel from "./models/User";
import ReviewModel from "./models/Review";

const connectDb = async () => {
  const options = {
    useNewUrlParser: true,
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
  } as ConnectOptions;

  try {
    const connection = await connect(MONGODB_URI, options);
    console.log(`mongodb connected: ${connection.connection.host}`);
  } catch (error) {
    console.log(
      "MongoDB connection unsuccessful, retry after 2 seconds.",
      error
    );
  }
};
connectDb();
/* READ JSON FILES */
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/db/_db_data/bootcamps.json`, "utf-8")
);
const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/db/_db_data/courses.json`, "utf-8")
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/db/_db_data/users.json`, "utf-8")
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/db/_db_data/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await BootcampModel.create(bootcamps);
    await CourseModel.create(courses);
    await UserModel.create(users);
    await ReviewModel.create(reviews);
    console.log("Data Imported...");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

/* DELETE DATA */
const deleteData = async () => {
  try {
    await BootcampModel.deleteMany();
    await CourseModel.deleteMany();
    await UserModel.deleteMany();
    await ReviewModel.deleteMany();
    console.log("Data destroyed...");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
