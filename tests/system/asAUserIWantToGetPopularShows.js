const assert = require("assert");
// const request = require("supertest-as-promised");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../src/webserver/server");

const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const popularShowsSuccess = require("../fixtures/popular-show-success-response.json");
const should = chai.should();

  it('should return 200 with the information', () =>
    request(app)
    .get('/api/v2/show/popular')
    .expect(200)
    .then(response => assert.equal(response.body.results.length, 20))
  );
});
