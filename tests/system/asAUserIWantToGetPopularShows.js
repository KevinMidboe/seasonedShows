import assert from "assert";
import chai from "chai";
import chaiHttp from "chai-http";

import server from "../../src/webserver/server.js";
import resetDatabase from "../helpers/resetDatabase.js";
import createCacheEntry from "../helpers/createCacheEntry.js";
import readFixtureContents from "../helpers/importFixture.js";

chai.use(chaiHttp);

const popularShowsSuccess = readFixtureContents(
  "popular-show-success-response.json"
);

describe("As a user I want to get popular shows", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createCacheEntry("tmdb/pt:1", popularShowsSuccess));

  it("should return 200 with the information", done => {
    chai
      .request(server)
      .get("/api/v2/show/popular")
      .end((error, response) => {
        assert.equal(response?.status, 200);
        done();
      });
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
