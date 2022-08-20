/* eslint-disable no-return-assign */
const net = require("net");
const server = require("../../src/webserver/server");

xdescribe('As a developer I want the server to start', () => {
  beforeEach(() =>
    this.server = require('src/webserver/server'));

  it('should listen on port 31400', (done) => {
    net.createConnection(31400, done);
  });

  afterEach(() =>
    this.server.close());
});
