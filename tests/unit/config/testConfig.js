import assert from "assert";
import Configuration from "../../../src/config/configuration.js";

const configuration = Configuration.getInstance();

let backedUpEnvironmentVariables;
let backedUpConfigFields;

describe("Config", () => {
  beforeEach(() => {
    backedUpEnvironmentVariables = { ...process.env };
    backedUpConfigFields = { ...configuration.fields };
  });

  afterEach(() => {
    process.env = backedUpEnvironmentVariables;
    configuration.fields = backedUpConfigFields;
  });

  it("should retrieve section and option from config file", () => {
    configuration.fields = { webserver: { port: 1337 } };
    assert.equal(configuration.get("webserver", "port"), 1337);
  });

  it("should resolve to environment variables if option is filtered with env", () => {
    configuration.fields = {
      webserver: { port: "env|SEASONED_WEBSERVER_PORT" }
    };
    process.env.SEASONED_WEBSERVER_PORT = "1338";
    assert.equal(configuration.get("webserver", "port"), 1338);
  });

  it("raises an exception if the environment variable does not exist", () => {
    configuration.fields = { webserver: { port: "env|DOES_NOT_EXIST" } };
    process.env.SEASONED_WEBSERVER_PORT = "1338";
    assert.throws(() => configuration.get("webserver", "port"), /empty/);
  });

  it("raises an exception if the environment variable is empty", () => {
    configuration.fields = {
      webserver: { port: "env|SEASONED_WEBSERVER_PORT" }
    };
    process.env.SEASONED_WEBSERVER_PORT = "";
    assert.throws(() => configuration.get("webserver", "port"), /empty/);
  });

  it("raises an exception if the section does not exist in the file", () => {
    configuration.fields = { webserver: { port: "1338" } };
    assert.throws(() => configuration.get("woops", "port"), /does not exist/);
  });

  it("raises an exception if the option does not exist in the file", () => {
    configuration.fields = { webserver: { port: "1338" } };
    assert.throws(
      () => configuration.get("webserver", "woops"),
      /does not exist/
    );
  });

  it("returns an array if field is an array", () => {
    configuration.fields = { bouncer: { whitelist: [1, 2, 3] } };
    assert.deepEqual(configuration.get("bouncer", "whitelist"), [1, 2, 3]);
  });

  it("decodes field as base64 if base64| is before the variable", () => {
    configuration.fields = { webserver: { port: "base64|MTMzOA==" } };
    assert.equal(configuration.get("webserver", "port"), 1338);
  });

  it("decodes environment variable as base64 if BASE64= is before the variable", () => {
    configuration.fields = {
      webserver: { port: "env|base64|SEASONED_WEBSERVER_PORT" }
    };
    process.env.SEASONED_WEBSERVER_PORT = "MTMzOA==";
    assert.equal(configuration.get("webserver", "port"), 1338);
  });
});
