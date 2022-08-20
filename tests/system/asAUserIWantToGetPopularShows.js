// const assert = require("assert");
// const request = require("supertest-as-promised");
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/webserver/server");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const popularShowsSuccess = require("../fixtures/popular-show-success-response.json");
// const should = chai.should();

chai.use(chaiHttp);
// describe("system test", () => {
//   it("should run", () => {
//     assert.equal(1, 1);
//   });
// });

describe("As a user I want to get popular shows", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createCacheEntry("pt:1", popularShowsSuccess));

  it("should return 200 with the information", done => {
    chai
      .request(server)
      .get("/api/v2/show/popular")
      .end((error, response) => {
        response.should.have.status(200);
        done();
      });

    // done();
  });

  // .end((err, res) => {
  //   // res.should.have.status(200);
  //   // res.body?.results?.should.be.a("array");
  //   // res.body?.results?.length.should.be.eq(20);
  //   done();
  // }));
  // .expect(200));
  // .then(response => {
  //   assert.equal(response.body?.results?.length, 20);
  // }));
});
