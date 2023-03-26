import { ConnectOptions, connect } from "mongoose";
import { MONGODB_URI } from "../config/config";

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

export default connectDb;
