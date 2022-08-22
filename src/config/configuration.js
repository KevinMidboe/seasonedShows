import path from "path";
import Field from "./field";

let instance = null;

class Config {
  constructor() {
    this.location = Config.determineLocation();
    // eslint-disable-next-line import/no-dynamic-require, global-require
    this.fields = require(`${this.location}`);
  }

  static getInstance() {
    if (instance == null) {
      instance = new Config();
    }
    return instance;
  }

  static determineLocation() {
    return path.join(__dirname, "..", "..", process.env.SEASONED_CONFIG);
  }

  get(section, option) {
    if (
      this.fields[section] === undefined ||
      this.fields[section][option] === undefined
    ) {
      throw new Error(`Field "${section} => ${option}" does not exist.`);
    }

    const field = new Field(this.fields[section][option]);

    const envField =
      process.env[[section.toUpperCase(), option.toUpperCase()].join("_")];
    if (envField !== undefined && envField.length !== 0) {
      return envField;
    }

    if (field.value === undefined) {
      throw new Error(`${section} => ${option} is empty.`);
    }

    return field.value;
  }
}

export default Config;
