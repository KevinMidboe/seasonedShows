const assert = require("assert");
const Filters = require("../../../src/config/filters");

describe("Filters", () => {
  it("should extract base64 as filter if it is at start of string followed by pipe", () => {
    const filters = new Filters("base64|");
    assert.deepEqual(filters.filters, ["base64"]);
  });

  it("should extract base64 and env as filters if both are separated by pipe", () => {
    const filters = new Filters("base64|env|");
    assert.deepEqual(filters.filters, ["base64", "env"]);
  });

  it("should not extract any filters if none are present", () => {
    const filters = new Filters("base64");
    assert.deepEqual(filters.filters, []);
  });

  it("should strip env filter from the value", () => {
    const filters = new Filters("env|HELLO");
    assert.deepEqual(filters.removeFiltersFromValue(), "HELLO");
  });

  it("should strip env and base64 filter from the value", () => {
    const filters = new Filters("env|base64|HELLO");
    assert.deepEqual(filters.removeFiltersFromValue(), "HELLO");
  });

  it("should strip no filters from the value if there are no filters", () => {
    const filters = new Filters("HELLO");
    assert.deepEqual(filters.removeFiltersFromValue(), "HELLO");
  });
});
