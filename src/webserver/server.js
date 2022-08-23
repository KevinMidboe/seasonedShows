import Configuration from "../config/configuration.js";
import app from "./app.js";

const configuration = Configuration.getInstance();

export default app.listen(configuration.get("webserver", "port"), () => {
  /* eslint-disable no-console */
  console.log("seasonedAPI");
  console.log(
    `Database is located at ${configuration.get("database", "host")}`
  );
  console.log(
    `Webserver is listening on ${configuration.get("webserver", "port")}`
  );
});
