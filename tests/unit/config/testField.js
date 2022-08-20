const assert = require("assert");
const Field = require("../../../src/config/field");

describe("Field", () => {
  it("should return an array if it is an array", () => {
    const field = new Field([1, 2, 3]);
    assert.deepEqual(field.value, [1, 2, 3]);
  });

  it("should return the plain value if it is an ordinary field", () => {
    const field = new Field("plain value");
    assert.equal(field.value, "plain value");
  });

  it("should return false if boolean false is field", () => {
    const field = new Field(false);
    assert.equal(field.value, false);
  });

  it("should not include any invalid filters", () => {
    const field = new Field("invalid-filter|plain value");
    assert.equal(field.value, "plain value");
  });

  it("should return the decoded value if it is filtered through base64", () => {
    const field = new Field("base64|ZW5jb2RlZCB2YWx1ZQ==");
    assert.equal(field.value, "encoded value");
  });

  it("should not decode the value if it missing the filter", () => {
    const field = new Field("ZW5jb2RlZCB2YWx1ZQ==");
    assert.equal(field.value, "ZW5jb2RlZCB2YWx1ZQ==");
  });

  it("should retrieve the environment variable if env filter is used", () => {
    const environmentVariables = { REDIS_URL: "redis://127.0.0.1:1234" };
    const field = new Field("env|REDIS_URL", environmentVariables);
    assert.equal(field.value, "redis://127.0.0.1:1234");
  });

  it("should return undefined if the environment variable does not exist", () => {
    const environmentVariables = { HTTP_PORT: 8080 };
    const field = new Field("env|REDIS_URL", environmentVariables);
    assert.equal(field.value, undefined);
  });

  it("should return undefined if the environment variable is an empty string", () => {
    const environmentVariables = { REDIS_URL: "" };
    const field = new Field("env|REDIS_URL", environmentVariables);
    assert.deepEqual(field.value, undefined);
  });

  describe("Multiple filters", () => {
    it("should decode the environment variable if base64 and env filter are used", () => {
      const environmentVariables = {
        REDIS_URL: "cmVkaXM6Ly9kYWdibGFkZXQubm8vMTIzNA=="
      };
      const field = new Field("env|base64|REDIS_URL", environmentVariables);
      assert.equal(field.value, "redis://dagbladet.no/1234");
    });

    it("should disregard the order of filters when env and base64 are used", () => {
      const environmentVariables = {
        REDIS_URL: "cmVkaXM6Ly9kYWdibGFkZXQubm8vMTIzNA=="
      };
      const field = new Field("base64|env|REDIS_URL", environmentVariables);
      assert.equal(field.value, "redis://dagbladet.no/1234");
    });

    it("should return undefined if both filters are used and env var does not exist", () => {
      const environmentVariables = {
        REDIS_URL: "cmVkaXM6Ly9kYWdibGFkZXQubm8vMTIzNA=="
      };
      const field = new Field("base64|env|REDIS_LOL", environmentVariables);
      assert.equal(field.value, undefined);
    });
  });
});
