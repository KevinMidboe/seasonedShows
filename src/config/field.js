import Filters from "./filters.js";
import EnvironmentVariables from "./environmentVariables.js";

class Field {
  constructor(rawValue, environmentVariables) {
    this.rawValue = rawValue;
    this.filters = new Filters(rawValue);
    this.valueWithoutFilters = this.filters.removeFiltersFromValue();
    this.environmentVariables = new EnvironmentVariables(environmentVariables);
  }

  get value() {
    if (this.filters.isEmpty()) {
      return this.valueWithoutFilters;
    }

    if (this.filters.has("base64") && !this.filters.has("env")) {
      return Field.base64Decode(this.valueWithoutFilters);
    }

    if (
      this.environmentVariables.has(this.valueWithoutFilters) &&
      this.environmentVariables.get(this.valueWithoutFilters) === ""
    ) {
      return undefined;
    }

    if (!this.filters.has("base64") && this.filters.has("env")) {
      if (this.environmentVariables.has(this.valueWithoutFilters)) {
        return this.environmentVariables.get(this.valueWithoutFilters);
      }
      return undefined;
    }

    if (this.filters.has("env") && this.filters.has("base64")) {
      if (this.environmentVariables.has(this.valueWithoutFilters)) {
        const encodedEnvironmentVariable = this.environmentVariables.get(
          this.valueWithoutFilters
        );
        return Field.base64Decode(encodedEnvironmentVariable);
      }
      return undefined;
    }

    return this.valueWithoutFilters;
  }

  static base64Decode(string) {
    return Buffer.from(string, "base64").toString("utf-8");
  }
}

export default Field;
