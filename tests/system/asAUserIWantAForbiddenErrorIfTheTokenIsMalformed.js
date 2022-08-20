const request = require("supertest-as-promised");
const app = require("../../src/webserver/app");
const resetDatabase = require("../helpers/resetDatabase");
// const assert = require("assert");

describe("As a user I want a forbidden error if the token is malformed", () => {
  beforeEach(() => resetDatabase());

  it("should return 401", () =>
    request(app)
      .get("/api/v1/user/settings")
      .set("Authorization", "maLfOrMed TOKEN")
      .expect(401));
  // .then(response => {
  //   assert.equal(response.body.error, "You must be logged in.");
  // }));
});
