/* eslint-disable no-return-assign */
const net = require("net");
const server = require("../../src/webserver/server");

describe("As a developer I want the server to start", () => {
  after(() => {
    server.close();
  });

  it("should listen on port 31400", done => {
    net.createConnection(31400, done);
  });
});
