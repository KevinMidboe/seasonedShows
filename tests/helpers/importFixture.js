import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function determineLocation(fixtureFilename) {
  return path.join(__dirname, "..", "fixtures", fixtureFilename);
}

export default function readFixtureContents(fixtureFilename) {
  const location = determineLocation(fixtureFilename);

  let content = {};
  try {
    content = JSON.parse(fs.readFileSync(location, { encoding: "utf-8" }));
  } catch (err) {
    console.error(`Error loading fixture file at path: ${location}`);
  }

  return content;
}
