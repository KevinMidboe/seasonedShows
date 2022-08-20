const assert = require("assert");
const chai = require("chai");
const chaiHttp = require("chai-http");

const server = require("../../src/webserver/server");
const createUser = require("../helpers/createUser");
const createToken = require("../helpers/createToken");
const resetDatabase = require("../helpers/resetDatabase");
const createCacheEntry = require("../helpers/createCacheEntry");
const infoMovieSuccess = require("../fixtures/blade_runner_2049-info-success-response.json");

chai.use(chaiHttp);

describe("As a user I want to request a movie", () => {
  beforeEach(() => resetDatabase());
  beforeEach(() => createUser("test_user", "test@gmail.com", "password"));
  beforeEach(() => createCacheEntry("mi:335984:false", infoMovieSuccess));

  it("should return 200 when item is requested", () => {
    chai
      .request(server)
      .post("/api/v2/request")
      .set("authorization", createToken("test_user", "secret"))
      .send({ id: 335984, type: "movie" })
      .end((error, response) => {
        assert.equal(response?.status, 200);
      });
  });
});
