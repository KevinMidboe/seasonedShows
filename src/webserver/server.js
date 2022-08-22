import Configuration from "../config/configuration";
import app from "./app";

const configuration = Configuration.getInstance();

export default app.listen(config.get("webserver", "port"), () => {
  /* eslint-disable no-console */
  console.log("seasonedAPI");
  console.log(`Database is located at ${config.get("database", "host")}`);
  console.log(`Webserver is listening on ${config.get("webserver", "port")}`);
});
