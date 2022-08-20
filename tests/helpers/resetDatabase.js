// class EstablishedDatabase {
//   constructor() {}

//   tearDown() {
//     console.log("mock teardown");
//   }

//   setup() {
//     console.log("mock setup");
//   }
// }

const establishedDatabase = require("../../src/database/database");
// const establishedDatabase = new EstablishedDatabase();

function resetDatabase() {
  return Promise.resolve()
    .then(() => establishedDatabase.tearDown())
    .then(() => establishedDatabase.setUp());
}

module.exports = resetDatabase;
