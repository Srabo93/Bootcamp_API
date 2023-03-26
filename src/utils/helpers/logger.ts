import { join } from "path";
const filename = join(__dirname, "../../logs/project.log");

//you can change format according to you
const log = require("simple-node-logger").createSimpleLogger({
  logFilePath: filename,
  timestampFormat: "YYYY-MM-DD HH:mm:ss",
});
export default { log };
