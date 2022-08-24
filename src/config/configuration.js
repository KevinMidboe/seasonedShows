import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import Field from "./field.js";

let instance = null;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Config {
  constructor() {
    this.location = Config.determineLocation();
    this.fields = Config.readFileContents(this.location);
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

  static readFileContents(location) {
    let content = {};
    try {
      content = JSON.parse(fs.readFileSync(location, { encoding: "utf-8" }));
    } catch (err) {
      console.error(`Error loading configuration file at path: ${location}`);
    }

    return content;
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
