/* eslint-disable no-return-assign */
const net = require('net');

xdescribe('As a developer I want the server to start', () => {
  beforeEach(() =>
    this.server = require('src/webserver/server'));

  it('should listen on port 31459', (done) => {
    net.createConnection(31459, done);
  });

  afterEach(() =>
    this.server.close());
});
