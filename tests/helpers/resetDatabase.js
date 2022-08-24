// class EstablishedDatabase {
//   constructor() {}

//   tearDown() {
//     console.log("mock teardown");
//   }

//   setup() {
//     console.log("mock setup");
//   }
// }

import establishedDatabase from "../../src/database/database.js";
// const establishedDatabase = new EstablishedDatabase();

export default function resetDatabase() {
  return Promise.resolve()
    .then(() => establishedDatabase.tearDown())
    .then(() => establishedDatabase.setUp());
}
