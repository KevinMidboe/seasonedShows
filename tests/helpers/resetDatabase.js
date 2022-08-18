const establishedDatabase = require('src/database/database');

function resetDatabase() {   
   return Promise.resolve()
      .then(() => establishedDatabase.tearDown())
      .then(() => establishedDatabase.setUp())
}

module.exports = resetDatabase;
